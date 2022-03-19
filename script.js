const form = document.querySelector('form');
const result = document.querySelector('.result');

form.addEventListener('submit', (e) => {
  e.preventDefault();
  result.innerHTML = '<p><b>Loading...</b></p>';
  const word = form.word.value;

  fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`)
    .then((res) => res.json())
    .then((data) => {
      if (data.title) {
        result.innerHTML = `<h3><strong>${data.title}</strong></h3> <br/>`;
        return;
      }

      result.innerHTML = `<h3><strong>${data[0].word}</strong></h3> <br/>`;

      data[0].meanings.forEach((meaning) => {
        result.innerHTML += `<hr/><p><strong><small>
         ${meaning.partOfSpeech}</small> </strong> <br/>
        ${meaning.definitions[0].definition}<br/>
        <em>${
          meaning.definitions[0].example ? meaning.definitions[0].example : ''
        }</em></p>`;
      });
    });
});
