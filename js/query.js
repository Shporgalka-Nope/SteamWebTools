//Getting collection Id from user input

//Static addresses for fetch
const collectionFetch = 'https://cors-anywhere.herokuapp.com/https://api.steampowered.com/ISteamRemoteStorage/GetCollectionDetails/v1/';
const itemInfoFetch = 'https://cors-anywhere.herokuapp.com/https://api.steampowered.com/ISteamRemoteStorage/GetPublishedFileDetails/v1/';

//Start here
document.getElementById('formId').addEventListener('submit', (e) => {
    e.preventDefault();
    let collectionId = document.getElementById('collectionId-input').value;
    let collectionParams = new FormData(e.target);
    collectionParams.append('collectioncount', '1');
    collectionParams.append('publishedfileids[0]', `${collectionId}`);
    Submit(collectionFetch, collectionParams);

});

async function Submit(fetchTarget, formParams) {
    await fetch(fetchTarget, {
        method: 'POST',
        // mode: 'no-cors',
        body: formParams,
    })
    .then((response) => { if(response.ok) return response.json(); })
    .then((data) => {
        data.response.collectiondetails[0].children.forEach(element => {
            let itemParams = new FormData();
            itemParams.append('itemcount', '1');
            itemParams.append('publishedfileids[0]', `${element.publishedfileid}`);
            // itemParams.entries().forEach(element => console.log(element));

            fetch(itemInfoFetch, {
                method: 'POST',
                body: itemParams,
            })
            .then((response) => { if(response.ok) return response.json() })
            .then((data) => {
                console.log((data.response.publishedfiledetails[0].file_size / (1024 * 1024)).toFixed(1));
            })
        });
    })
}