const algoliasearch = require('algoliasearch');

const client = algoliasearch('691PDCNR9Q', 'ef82543d210b0a8d6b19f2fdaa58d84f');
// name of the index to add objects to.
const index = client.initIndex('users');

let algoliaController = {
    addData: (users) => {
        index
            .saveObjects(users, { autoGenerateObjectIDIfNotExist: true })
            .then(({ objectIDs }) => {
                console.log(objectIDs);
            });;
    },

    setSearchAttributes: () => {
        index.setSettings({ searchableAttributes: ["name", "email"] }).catch(error => { console.log(error) });
    },

    setCustomRankings: () => {
        index.setSettings({ customRanking: ["desc(name, email)"] }).catch(error => {console.log(error)});
    },

    removeCurrentUser: (currentUserID) => {
        index.deleteObject(currentUserID);
    }
}

module.exports = algoliaController;