const client = algoliasearch('691PDCNR9Q', 'cc9618d9eb730c8f4d8773b668175030');
const users = client.initIndex('users');

autocomplete('#aa-search-input', {}, [
    {
      source: autocomplete.sources.hits(users, { hitsPerPage: 3 }),
      displayKey: 'email',
      templates: {
        header: '<div class="aa-suggestions-category">Users</div>',
        suggestion({_highlightResult}) {
          return `
          <span>${_highlightResult.name.value}</span> <br>
          <span>${_highlightResult.email.value}</span>
          `;
        }
      }
    },
]);