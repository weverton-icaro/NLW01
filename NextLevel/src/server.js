const express = require("express")
const server = express()

//Pegar o banco de dados
const db = require("./database/db")

//configurar pasta publica
server.use(express.static("public"))

//habilitando uso do req.body na aplicação
server.use(express.urlencoded({extended: true}))


//utilizando template engine
const nunjucks = require("nunjucks")
nunjucks.configure("src/views", {
  express: server,
  noCache: true
})

//Configurando caminhos
//pagina inicial
server.get("/", (req, res) => {
  return res.render("index.html")
})

server.get("/create-point", (req, res) => {

  console.log(req.query)

  return res.render("create-point.html")
})
server.post("/save-point", (req, res) =>{
  // req.body : corpo do formulário
  //console.log(req.body)

  //Inserindo dados no banco de dados
  const query = `
    INSERT INTO places (
      image,
      name,
      address,
      address2,
      state,
      city,
      items
    ) VALUES (?,?,?,?,?,?,?);
  `

  const values = [
    req.body.image,
    req.body.name,
    req.body.address,
    req.body.address2,
    req.body.state,
    req.body.city,
    req.body.items
  ]

  function afterInsertData(err) {
    if(err) {
      console.log(err)
      return res.render("create-point.html", {err: true})
    }

    console.log("Cadastrado com sucesso!")
    console.log(this)

    return res.render("create-point.html", {saved: true})
  }

  db.run(query, values, afterInsertData)


})

server.get("/search", (req, res) => {

  const search = req.query.search

  if(search == "") {
    //pesquisa vazia
    return res.render("search-results.html", {total: 0})
  }

  //Pegar os dados do banco de dados
  db.all(`SELECT * FROM places WHERE city LIKE '%${search}%'`, function(err, rows) {
    if(err) {
      return console.log(err)
    }

    console.log("Aqui estão seus registros:")
    console.log(rows)

    const total = rows.length

    //Mostrar pagina com os dados do banco de Dados
    return res.render("search-results.html", { places: rows, total})
  })

})



//Ligar servidor
server.listen(3000)
