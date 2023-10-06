const express = require("express")
const app = express()
const handlebars = require("express-handlebars").engine
const bodyParser = require("body-parser")
// const post = require("./model/post")

const { initializeApp } = require("firebase/app");
const { getFirestore, collection, doc, addDoc, updateDoc, deleteDoc, getDocs, query, getDoc } = require("firebase/firestore");

const firebaseConfig = {
  apiKey: "AIzaSyA76lNjSDNIaBW9z_f5iFIYGlvInbir5SI",
  authDomain: "tarefa-f75ae.firebaseapp.com",
  projectId: "tarefa-f75ae",
  storageBucket: "tarefa-f75ae.appspot.com",
  messagingSenderId: "738705976384",
  appId: "1:738705976384:web:94d55f56dbf7996e4d43a5",
  measurementId: "G-ERYVC6P1R2"
};

const firebaseApp = initializeApp(firebaseConfig)

const db = getFirestore(firebaseApp);

app.engine("handlebars", handlebars({defaultLayout: "main"}))
app.set("view engine", "handlebars")

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

app.get("/", function(req, res){
    res.render("primeira_pagina")
})

app.post("/cadastrar", function(req, res){
    addDoc(collection(db, "agendamentos"), {
      nome: req.body.nome,
      endereco: req.body.endereco,
      bairro: req.body.bairro,
      cep: req.body.cep

  }).then(() => {
    console.log("dados cadastrados com sucesso! ")
    res.send("Cadastro realizado com sucesso!")
  }).catch(function(err){
    console.log("Erro ao cadastrar: " + err)
  })
})

app.listen(8081, function(){
    console.log("Servidor Ativo!")
})

app.get("/consulta", function(req, res){
    getDocs(query(collection(db, "agendamentos"))).then(result => {
      let dataArr = []
      result.forEach(ndoc => {
        let data = ndoc.data();
        data.id = ndoc.id;
        dataArr.push(data);
      })
      
      res.render("consulta", {post: dataArr})
    }).catch(err => {
      console.log("Erro ao carregar dados do banco: " + err)
    })
})

app.get("/excluir/:id", function(req, res){
    deleteDoc(doc(collection(db, "agendamentos"), req.params.id)).then(() => {
      res.redirect("/")
    })
    .catch(err => {
      console.log("Erro ao excluir ou encontrar os dados do banco: " + err)
    })
})

app.get("/editar/:id", function(req, res){
    getDoc(doc(collection(db, "agendamentos"), req.params.id)).then(ndoc => {
      let data = ndoc.data();
      data.id = ndoc.id
      res.render("editar", {post: data})
    }).catch(err => {
      console.log("Erro ao excluir ou encontrar os dados do banco: " + err)
    })
})

app.post("/atualizar", function(req, res){
    updateDoc(doc(collection(db, "agendamentos"), req.body.id), {
      nome: req.body.nome,
      endereco: req.body.endereco,
      bairro: req.body.bairro,
      cep: req.body.cep
  }).then(() => {
    res.redirect("/consulta")
  }).catch(err => {
    console.log("Erro ao atualizar os dados do banco: " + err);
  })
})
