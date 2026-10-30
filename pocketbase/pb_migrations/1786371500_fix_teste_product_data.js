/// <reference path="../pb_data/types.d.ts" />

// Corrige os dados mal cadastrados do produto de teste
// "Geladeira Frost Free Duplex 400L — TESTE":
//  - especificações técnicas estavam digitadas no campo `consideracoes`
//    (specs estava vazio) -> mover para `specs` como nome + valor.
//  - o link de compra tinha a URL colada dentro do nome da plataforma
//    (`loja`) com `url` vazio -> separar nome da plataforma e URL.
//  - preserva preço, marca, categoria, segmento, keywords, resumo e ativo.
migrate(
  (app) => {
    const collection = app.findCollectionByNameOrId("products");

    let record;
    try {
      record = app.findRecordById(collection, "eup5ss1xompv6l9");
    } catch (e) {
      // produto de teste não existe neste ambiente — nada a fazer.
      return;
    }

    if (!record) return;

    // 1) Especificações técnicas (nome + valor)
    record.set("specs", [
      { nome: "Capacidade", valor: "400 litros" },
      { nome: "Tipo", valor: "Frost Free" },
    ]);

    // 2) Considerações finais — agora vazia, pois o conteúdo era na verdade
    //    a especificação técnica que foi movida para `specs`.
    record.set("consideracoes", "");

    // 3) Link de compra: separar nome da plataforma e URL.
    //    O valor original de `loja` era "Amazon — TESTE" + URL longa.
    const GOOGLE_URL =
      "https://www.google.com/search?gs_ssp=eJzj4tDP1TfITc9OV2A0YHRg8GJLzE2sys8DAELoBhw&q=amazon&rlz=1C1VDKB_pt-PTBR1137BR1137&oq=AMAZ&gs_lcrp=EgZjaHJvbWUqEAgBEC4YxwEYsQMY0QMYgAQyBggAEEUYOTIQCAEQLhjHARixAxjRAxiABDIKCAIQABixAxiABDINCAMQABiDARixAxiABDIKCAQQABixAxiABDIKCAUQABixAxiABDINCAYQABiDARixAxiABDIKCAcQABixAxiABNIBCTM1MDNqMGoxNagCCLACAfEFpQ1OPu1DVzI&sourceid=chrome&source=chrome.rb&ie=UTF-8";
    record.set("links", [{ loja: "Amazon — TESTE", url: GOOGLE_URL }]);

    app.save(record);
  },
  (app) => {
    // Down: reverte para o estado anterior conhecido.
    const collection = app.findCollectionByNameOrId("products");
    let record;
    try {
      record = app.findRecordById(collection, "eup5ss1xompv6l9");
    } catch (e) {
      return;
    }
    if (!record) return;
    record.set("specs", []);
    record.set(
      "consideracoes",
      "Capacidade → 400 litros e Tipo → Frost Free.",
    );
    record.set("links", [
      {
        loja: "Amazon — TESTEhttps://www.google.com/search?gs_ssp=eJzj4tDP1TfITc9OV2A0YHRg8GJLzE2sys8DAELoBhw&q=amazon&rlz=1C1VDKB_pt-PTBR1137BR1137&oq=AMAZ&gs_lcrp=EgZjaHJvbWUqEAgBEC4YxwEYsQMY0QMYgAQyBggAEEUYOTIQCAEQLhjHARixAxjRAxiABDIKCAIQABixAxiABDINCAMQABiDARixAxiABDIKCAQQABixAxiABDIKCAUQABixAxiABDINCAYQABiDARixAxiABDIKCAcQABixAxiABNIBCTM1MDNqMGoxNagCCLACAfEFpQ1OPu1DVzI&sourceid=chrome&source=chrome.rb&ie=UTF-8",
        url: "",
      },
    ]);
    app.save(record);
  },
);
