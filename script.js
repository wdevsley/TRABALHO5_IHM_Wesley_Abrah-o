/* ==========================================================
   Marca os passos concluídos, atualiza a barra de progresso
   e mostra o selo "concluído" na página inicial.
   O mesmo arquivo é usado em todas as páginas.
   ========================================================== */

(function () {
  "use strict";

  var CHAVE = "tutoriais-manutencao";

  function lerProgresso() {
    try {
      return JSON.parse(localStorage.getItem(CHAVE)) || {};
    } catch (e) {
      return {};
    }
  }

  function salvarProgresso(dados) {
    try {
      localStorage.setItem(CHAVE, JSON.stringify(dados));
    } catch (e) {
      /* navegador sem permissão para salvar: o site continua funcionando */
    }
  }

  /* ---------- páginas de tutorial ---------- */

  function iniciarTutorial(id) {
    var passos = Array.prototype.slice.call(
      document.querySelectorAll(".passo-check"),
    );
    if (passos.length === 0) return;

    var preenchida = document.querySelector(".barra-preenchida");
    var texto = document.querySelector(".progresso-texto");
    var dados = lerProgresso();
    var marcados = (dados[id] && dados[id].marcados) || [];

    passos.forEach(function (caixa, indice) {
      caixa.checked = marcados.indexOf(indice) !== -1;
      caixa.addEventListener("change", atualizar);
    });

    function atualizar() {
      var feitos = [];
      passos.forEach(function (caixa, indice) {
        if (caixa.checked) feitos.push(indice);
      });

      var total = passos.length;
      var pronto = feitos.length;

      if (preenchida) {
        preenchida.style.width = Math.round((pronto / total) * 100) + "%";
      }
      if (texto) {
        texto.textContent =
          pronto === total
            ? "Tutorial concluído — todos os " + total + " passos marcados."
            : pronto + " de " + total + " passos concluídos";
      }

      var dadosAtuais = lerProgresso();
      dadosAtuais[id] = { marcados: feitos, total: total };
      salvarProgresso(dadosAtuais);
    }

    atualizar();
  }

  /* ---------- página inicial ---------- */

  function iniciarIndice() {
    var dados = lerProgresso();
    var cartoes = document.querySelectorAll("[data-tutorial]");

    Array.prototype.forEach.call(cartoes, function (cartao) {
      var id = cartao.getAttribute("data-tutorial");
      var info = dados[id];
      var selo = cartao.querySelector(".selo-ok");
      if (!selo || !info || !info.total) return;

      if (info.marcados.length === info.total) {
        selo.hidden = false;
      } else if (info.marcados.length > 0) {
        selo.hidden = false;
        selo.textContent = info.marcados.length + "/" + info.total + " passos";
      }
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    var id = document.body.getAttribute("data-tutorial");
    if (id) {
      iniciarTutorial(id);
    } else {
      iniciarIndice();
    }
  });
})();
