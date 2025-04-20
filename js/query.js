class WorkShopItem {
    constructor(title, previewUrl, size) {
        this.title = title,
        this.previewUrl = previewUrl,
        this.size = size 
    }
}

//Getting resources
let buttonElement = document.getElementById('post-input');
let validationText = document.getElementById('validation-errors');
let weightText = document.getElementById('weight-p');
let listElement = document.getElementById('listElement');
let listDiv = document.getElementById('list-div');
listDiv.style.display = 'none';

//Static addresses for fetch
const collectionFetch = 'https://cors-anywhere.herokuapp.com/https://api.steampowered.com/ISteamRemoteStorage/GetCollectionDetails/v1/';
const itemInfoFetch = 'https://cors-anywhere.herokuapp.com/https://api.steampowered.com/ISteamRemoteStorage/GetPublishedFileDetails/v1/';

//Start here
document.getElementById('formId').addEventListener('submit', async (e) => {
    e.preventDefault();

    buttonElement.disabled = true;
    weightText.innerText = '';
    listElement.innerHTML = '';
    listDiv.style.display = 'none';

    let collectionId = getId(document.getElementById('collectionId-input').value);
    console.log(collectionId);

    let collectionParams = new FormData(e.target);
    collectionParams.append('collectioncount', '1');
    collectionParams.append('publishedfileids[0]', `${collectionId}`);
    weightText.innerText = `Collection size: ${await Submit(collectionFetch, collectionParams)} (Without required items)`;

    listDiv.style.display = 'block';
    buttonElement.disabled = false;
});

const valid = document.getElementById('collectionId-input');
valid.addEventListener('input', () => {
    if(!valid.validity.valid) { validationText.innerText = "Invalid link"; } 
    else { validationText.innerText = ""; }
});

function getId(link) {
    let id = "";
    for(i = -1; Math.abs(i) < link.length; i--) {
        if(link.at(i) === '=') break; 
        id += link.at(i);
    }
    return Array.from(id).reverse().join("");
}


async function Submit(fetchTarget, formParams) {
    //Initial search for collection details
    let data = await fetch(fetchTarget, {
        method: 'POST',
        body: formParams,
    })
    .then((response) => { if(response.ok) return response.json(); });
    
    //Searching for each item id
    let itemIds = new Array();
    data.response.collectiondetails[0].children.forEach(element => { itemIds.push(element.publishedfileid); });
    
    //Getting each item's info
    let itemsList = new Array();
    let totalWeight = 0;
    for (const item of itemIds) {
        let itemParams = new FormData();
        itemParams.append('itemcount', '1');
        itemParams.append('publishedfileids[0]', `${item}`);
        totalWeight += await fetch(itemInfoFetch, {
            method: 'POST',
            body: itemParams,
        })
        .then((response) => {if(response.ok) return response.json(); })
        .then((data) => { 
            //Creating item object
            let modTitle = data.response.publishedfiledetails[0].title;
            let modPreview = data.response.publishedfiledetails[0].preview_url;
            let modSize = `~${Number((data.response.publishedfiledetails[0].file_size / (1024 * 1024)).toFixed(2))} MB`;
            let item = new WorkShopItem(modTitle, modPreview, modSize);
            itemsList.push(item);
            return Number(data.response.publishedfiledetails[0].file_size) / (1024 * 1024); 
        });
    }
    let result = `~${totalWeight.toFixed(2)}MB`;
    console.log(result);
    console.log(itemsList.length);
    CreateFromArray(itemsList);
    return result;
}

function CreateFromArray(listOfItems) {
    for(let item of listOfItems) {

        //Preview Image
        let modImg = document.createElement('img');
        modImg.className = 'workshop-item-img';
        modImg.src = item.previewUrl;
        

        //Title
        let modP = document.createElement('p');
        modP.innerText = `Addon: ${item.title}\nSize: ${item.size}`;
        modP.className = 'workshop-item-p';

        //Size
        // let modPS = document.createElement('p');
        // modPS.innerText = item.size;
        // modPS.className = 'workshop-item-p';

        let infoContainer = document.createElement('div');
        infoContainer.className = 'workshop-item-infodiv';
        infoContainer.appendChild(modP);
        //infoContainer.appendChild(modPS);
        

        let itemContainer = document.createElement('div');
        itemContainer.className = 'workshop-item-div';
        itemContainer.appendChild(modImg);
        itemContainer.appendChild(infoContainer);

        let listItem = document.createElement('li');
        listItem.appendChild(itemContainer);

        listElement.appendChild(listItem);
    }
}