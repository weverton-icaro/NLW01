function popularUFs() {
  const ufSelect = document.querySelector("select[name=UF]")

  fetch("https://servicodados.ibge.gov.br/api/v1/localidades/estados")
  .then(res => res.json())
  .then( states => {
    for( const state of states) {
      ufSelect.innerHTML += `<option value="${state.id}">${state.nome}</option>`
    }
  })
}

popularUFs()

function getCities(event) {
  const citySelect = document.querySelector("[name=city]")
  const stateInput = document.querySelector("[name=state]")

  const ufValue = event.target.value

  const indexOfSelectedState = event.target.selectedIndex
  stateInput.value = event.target.options[indexOfSelectedState].text

  const url = `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${ufValue}/municipios`

  citySelect.innerHTML = "<option value> Selecione a Cidade</option>"
  citySelect.disabled = true

  fetch(url)
  .then(res => res.json())
  .then( cities => {

    for( const city of cities) {
      citySelect.innerHTML += `<option value="${city.nome}">${city.nome}</option>`
    }

    citySelect.disabled = false
  })
}

document
  .querySelector("select[name=UF]")
  .addEventListener("change", getCities)


//Itens de Coleta
//Selecionando as Li's
const itemsToCollect = document.querySelectorAll(".items-grid li")

for (const items of itemsToCollect) {
  items.addEventListener("click", handleSelectedItem)
}

const collectedItems = document.querySelector('input[name=items]')

let selectedItems = []

function handleSelectedItem(event) {

  const itemLi = event.target

  //add or remove class with javascript
  itemLi.classList.toggle("selected")

  const itemId = itemLi.dataset.id

  console.log('ITEM ID: ', itemId)

  //Verificando itens selecionados, se sim
  //Pegar os itens selecionados

  const alreadySelected = selectedItems.findIndex( item => {
    const itemFound = item == itemId  //Será True ou False
    return itemFound
  })

  //Tirando itens selecionados da seleção
  if (alreadySelected >= 0) {
    //Remover seleção
    const filteredItems = selectedItems.filter( item => {
      const itemDifferent = item != itemId //false
      return itemDifferent
    })

    selectedItems = filteredItems
  } else {
    //Se não selecionado, adicionar a seleção
    selectedItems.push(itemId)
  }

  console.log('selectedItems: ', selectedItems)

  //Atualizando campo escondido com itens selecionados
  collectedItems.value = selectedItems
}