/**
 * @name DiscordTracker
 * @author fake.io
 * @description This plugin show discord-tracker stats
 * @version 0.0.3
 * @authorId 924687451539247165
 */

module.exports = class DiscordTracker {
    interval = null;
    currentId = null;

    timeToString(timestamp) {
        const data = {};
    
        data.h = Math.floor(timestamp / 3600);
    
        if (data.h > 0) {
            timestamp -= data.h * 3600;
        }
    
        data.m = Math.floor(timestamp / 60);
    
        if (data.m > 0) {
            timestamp -= data.m * 60;
        }
    
        data.s = timestamp;
    
        return `${data.h}ч ${data.m}м ${data.s}с`;
    }

    async checkProfile() {
        const popout = document.querySelector('[class^="userPopoutInner_"]');
        
        if (!popout) { 
            this.currentId = null;
        } else {
            try {
                const id = popout.querySelector('img[class^="avatar__"]').src.split("/")[4];
                const section = popout.querySelector('div[class^="mutuals__"]');

                if (this.currentId != id) {
                    this.currentId = id;

                    section.outerHTML += `
                    <div class="activityBiteSizePopout__67f8f activity__47d03 plugin-tracker-data">
                        <div class="bodyNormal__77cee body__3620e">
                            <div class="activityDetails_b90109">
                                <div class="contentImagesBiteSizePopout_f9ea3c content__7246b" style="flex: 1 1 auto;">
                                    <div class="defaultColor__30336 text-md-semibold__8664f nameNormal_cb5c2b ellipsis__46552 textRow_c835f1"
                                        title="fake presence." data-text-variant="text-md/semibold"><span class="activityName_a7b7de">DISCORD
                                            TRACKER</span></div>
                                    <div class="details_e26997 ellipsis__46552 textRow_c835f1 views">Loading...</div>
                                    <div class="details_e26997 ellipsis__46552 textRow_c835f1 likes"></div>
                                    <div class="details_e26997 ellipsis__46552 textRow_c835f1 time"></div>
                                </div>
                            </div>

                            <button type="button" onclick="window.open('https://discord-tracker.com/tracker/user/${id}/','_blank')" class="button__88ad4 button__581d0 lookFilled__950dd buttonColor_b3c4e5 buttonSize__9da96 grow__4c8a4"><div class="contents__322f4">View</div></button>
                        </div>
                    </div>
                    `
    
                    const res = await BdApi.Net.fetch(`https://discord-tracker.com/tracker/get-victim-info/${id}/`, { timeout: 2000 });
                    
                    if (!res.ok) {
                        document.querySelector(".plugin-tracker-data .views").textContent = "Fetch error";
                    } else {
                        const data = await res.json();
                        console.log(data);
                        const rep = data["likes"] - data["dislikes"];
                        document.querySelector(".plugin-tracker-data .views").textContent = "Views: " + data["views"];
                        document.querySelector(".plugin-tracker-data .likes").innerHTML = `Rep: <span style="color: ${rep >= 0 ? '#3deb34' : '#eb3a34'}">${rep >= 0 ? '+' : ''}${rep}</span>`;
                        document.querySelector(".plugin-tracker-data .time").textContent = "Voice: " + (data['time_in_voice'] != undefined ? this.timeToString(data['time_in_voice']) : "0ч 0м 0с");
                    }
                }
            } catch (e) {
                console.error(e);
            };
        }
    }

    async callback() {
        try { await this.checkProfile(); }
        catch {};
    }

    async start() {
      this.interval = setInterval(async _ => await this.callback(), 300);
    } 

    stop() {
      clearInterval(this.interval);
    }
}
