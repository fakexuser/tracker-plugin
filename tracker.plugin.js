/**
 * @name DiscordTracker
 * @author fake.io
 * @description Этот плагин выводит статистику с discord tracker в профиль юзера
 * @version 0.0.1
 * @authorId 924687451539247165
 * @source https://github.com/fakexuser/tracker-plugin
 */

module.exports = class DiscordTracker {
    interval = null;
    currentId = null;

    async hookProfile() {
        const popout = document.querySelector('[class^="userPopoutOuter_"]');
        
        if (!popout) { 
            this.currentId = null;
        } else {
            try {
                const id = popout.querySelector('img[class^="avatar__"]').src.split("/")[4];
                const section = popout.querySelector('div[class^="divider_"]');
                    
                if (this.currentId != id) {
                    this.currentId = id;

                    section.outerHTML += `
                    <div style="margin: 4px 12px;" class="section__62b44 plugin-tracker-data">
                        <h2 class="defaultColor__30336 eyebrow_b3f8ba defaultColor__8610e title__392bc" data-text-variant="eyebrow">DISCORD TRACKER</h2>
                        <div class="views defaultColor__30336 lineClamp2Plus_ccc883 text-sm-normal__95a78" data-text-variant="text-sm/normal" style="-webkit-line-clamp: 6;"><span>Loading...</span></div>
                        <div class="likes defaultColor__30336 lineClamp2Plus_ccc883 text-sm-normal__95a78" data-text-variant="text-sm/normal" style="-webkit-line-clamp: 6;"><span></span></div>
                        <div onclick="window.open('https://discord-tracker.com/tracker/user/${id}/','_blank')" style="cursor: pointer; margin-top: 4px;" class="button__88ad4 button__581d0 lookFilled__950dd buttonColor_fd4fe8 buttonSize__9da96 grow__4c8a4">View profile</div>
                    </div>
                    `
    
                    const res = await BdApi.Net.fetch(`https://discord-tracker.com/tracker/get-victim-info/${id}/`, { timeout: 1000 });
                    
                    if (!res.ok) {
                        document.querySelector(".plugin-tracker-data .views").textContent = "Fetch error";
                    } else {
                        const data = await res.json();
                        document.querySelector(".plugin-tracker-data .views").textContent = "Views: " + data["views"];
                        document.querySelector(".plugin-tracker-data .likes").textContent = "Rep: " + (data["likes"] - data["dislikes"]);
                    }
                }
            } catch (e) {
                console.error(e);
            };
        }
    }

    async start() {
      this.interval = setInterval(async _ => await this.hookProfile(), 100);
    } 

    stop() {
      clearInterval(this.interval);
    }
}