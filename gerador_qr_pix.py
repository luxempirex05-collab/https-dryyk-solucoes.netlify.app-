# pip install qrcode[pil]
import qrcode

def gerar_qr_pix():
    print("🧾 GERADOR DE QR CODE PIX PARA RECEBIMENTO")
    print("=" * 50)
    
    # Solicita os dados ao usuário
    nome_recebedor = input("👤 Nome do recebedor (padrão: DRYYKK LUCAA): ").strip() or "DRYYKK LUCAA"
    chave_pix = input("🔑 Chave Pix (CPF, Celular, Email ou Aleatória): ").strip()
    valor = input("💰 Valor (ex: 50.00) - Deixe vazio se for definir na hora do pagamento: ").strip()
    cidade = input("🏙️ Cidade do recebedor: ").strip()
    descricao = input("📝 Descrição (ex: 'Pagamento pela peça X'): ").strip()[:25]  # Limite de 25 caracteres

    # Formata o valor (se vazio, deixa como '0.00')
    if not valor:
        valor = "0.00"

    # Monta a string do Payload Pix (versão simplificada - BR Code)
    # Formato básico:
    # 000201 + 26[tamanho]0014BR.GOV.BCB.PIX + 01[tamanho]chave_pix + 52040000 + 5303986 + 54[tamanho]valor + 5802BR + 59[tamanho]nome + 60[tamanho]cidade + 62[tamanho]05[tamanho]descricao + 6304
    # OBS: Este é um formato simplificado e NÃO é o oficial EMV. Para uso real, recomenda-se usar bibliotecas específicas ou APIs de bancos.

    # Montando payload manual (simplificado para testes)
    payload = f"00020126360014BR.GOV.BCB.PIX01{len(chave_pix):02d}{chave_pix}52040000530398654{len(valor):02d}{valor}5802BR59{len(nome_recebedor):02d}{nome_recebedor}60{len(cidade):02d}{cidade}62{len(descricao)+4:02d}05{len(descricao):02d}{descricao}6304"

    # Calcula CRC16 (simplificado - só para exemplo, não é válido para produção)
    # EM PRODUÇÃO, USE CRC16 REAL OU BIBLIOTECA ESPECÍFICA!
    # Aqui vamos colocar placeholder "ABCD"
    payload += "ABCD"

    print("\n✅ Payload gerado (simplificado para demonstração):")
    print(payload)
    print("-" * 80)

    # Gera QR Code
    qr = qrcode.QRCode(
        version=1,
        error_correction=qrcode.constants.ERROR_CORRECT_L,
        box_size=10,
        border=4,
    )
    qr.add_data(payload)
    qr.make(fit=True)

    img = qr.make_image(fill_color="black", back_color="white")

    nome_arquivo = f"qrcode_pix_{nome_recebedor.replace(' ', '_')}.png"
    img.save(nome_arquivo)

    print(f"🎉 QR Code salvo como: {nome_arquivo}")
    print("📱 Use um leitor de QR Code ou app de banco para testar!")

if __name__ == "__main__":
    gerar_qr_pix()