import * as communityConnection from "./connection/communityConnection.js";
import * as tagConnection from "./connection/tagConnection.js";
import { GENDERS } from "./constants.js";
import { TAG_MAP } from "./connection/tagConnection.js";

const groupMainInfoCont = document.querySelector('.group-main-info');
const groupFilterCont = document.querySelector('.group-tags');
const blogBlockCont = document.querySelector('.blog-block');

const tagSelect = document.getElementById('tags_filter');

const groupHeaderTemplate = document.getElementById('group_main_info_temp');
const groupPostTemplate = document.getElementById('group_post_temp');
const groupAdminTemplate = document.getElementById('group_admin_template');

var groupId = localStorage.getItem('group_id');

var communityInfo = await communityConnection.GetCommunityInfo(groupId);
console.log(communityInfo);

setHeader(communityInfo);

function setHeader(info) {
    var groupHeader = groupHeaderTemplate.content.cloneNode(true);

    groupHeader.querySelector('.group-header').querySelector('h2').textContent = info.name;
    groupHeader.querySelector('.group-subs').querySelector('a').textContent = info.subscribersCount + " подписчиков";

    let communityType = info.isClosed ? "закрытое" : "открытое";

    groupHeader.querySelector('.group-type').querySelector('a').textContent = `Тип сообщества: ${communityType}`;

    var groupAdminsCont = groupHeader.querySelector('.group-admins');

    info.administrators.forEach(element => {
        var admin = groupAdminTemplate.content.cloneNode(true);
        admin.querySelector('.admin-icon').classList.add(element.gender === GENDERS.MALE ? "male-image" : "female-image");
        admin.querySelector('a').textContent = element.fullName;

        groupAdminsCont.appendChild(admin);
    });

    groupMainInfoCont.appendChild(groupHeader);
}

TAG_MAP.keys().forEach(element => {
    var option = document.createElement('option');
    option.text = element;

    tagSelect.appendChild(option);
});

var posts = await communityConnection.GetCommunityPosts(groupId);
