const algoliasearch = require('algoliasearch');

const client = algoliasearch('691PDCNR9Q', 'cc9618d9eb730c8f4d8773b668175030');
// name of the index to add objects to.
const index = client.initIndex('users');

let algoliaController = {
    addData: (users) => {
        index
            .saveObjects(users, { autoGenerateObjectIDIfNotExist: true })
            .then(({ objectIDs }) => {
                console.log(objectIDs);
            })
            .catch( (error) => { console.log(error) });
    },

    setSearchAttributes: () => {
        index.setSettings({ searchableAttributes: ["name", "email"] }).catch(error => { console.log(error) });
    },

    setCustomRankings: () => {
        index.setSettings({ customRanking: ["desc(name, email)"] }).catch(error => {console.log(error)});
    },

    removeCurrentUser: (currentUserID) => {
        index.deleteObject(currentUserID).catch( (error) => { console.log(error) });
    }
}

module.exports = algoliaController;