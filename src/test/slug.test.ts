import { describe, expect, it } from "vitest";
import { isUuid, slugify } from "@/lib/slug";

describe("slugify", () => {
  it("remove acentos, caixa e pontuação", () => {
    expect(slugify("Painel para Visualização  de Dados")).toBe("painel-para-visualizacao-de-dados");
    expect(slugify("Dashboard de BI + IA")).toBe("dashboard-de-bi-ia");
    expect(slugify("Análise de Atrasos em Entregas.")).toBe("analise-de-atrasos-em-entregas");
  });

  it("não deixa hífens nas pontas", () => {
    expect(slugify("  Plataforma para gestão ")).toBe("plataforma-para-gestao");
    expect(slugify("--Dia 04/30--")).toBe("dia-04-30");
  });

  it("devolve vazio quando não há letras nem números", () => {
    expect(slugify("!!! ###")).toBe("");
  });
});

describe("isUuid", () => {
  it("reconhece UUIDs e rejeita slugs", () => {
    expect(isUuid("77ecb037-a884-40b3-b997-28033b474c4a")).toBe(true);
    expect(isUuid("rifa-online")).toBe(false);
  });
});
