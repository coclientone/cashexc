<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="description" content="Smart Transfer - worldwide money transfer services, exchange rates, transfer tracking and secure verification.">
<title> Smart Transfer</title>
<style>
:root{--navy:#081b33;--blue:#1769e0;--cyan:#21b7c9;--ink:#10243d;--muted:#63748a;--bg:#f5f8fc;--card:#fff;--line:#e5ebf3;--radius:18px}
*{box-sizing:border-box}body{margin:0;font-family:Inter,system-ui,-apple-system,Segoe UI,Arial,sans-serif;color:var(--ink);background:var(--bg);line-height:1.6}
a{text-decoration:none;color:inherit}.container{max-width:1180px;margin:auto;padding:0 22px}
header{background:rgba(8,27,51,.96);color:white;position:sticky;top:0;z-index:10;backdrop-filter:blur(12px)}
.nav{height:76px;display:flex;align-items:center;justify-content:space-between}.logo{font-size:22px;font-weight:800;letter-spacing:-.5px}.logo span{color:#35c4d5}
nav{display:flex;gap:26px;align-items:center}nav a{color:#d9e5f3;font-size:14px}nav a:hover{color:white}.btn{display:inline-block;padding:12px 19px;border-radius:10px;font-weight:700;font-size:14px;border:1px solid transparent;cursor:pointer}.btn-primary{background:linear-gradient(135deg,var(--blue),var(--cyan));color:white}.btn-light{background:white;color:var(--navy)}.btn-outline{border-color:#55708e;color:white}
.hero{background:radial-gradient(circle at 80% 20%,#173e6b 0,#081b33 48%,#061426 100%);color:white;padding:86px 0 76px}.hero-grid{display:grid;grid-template-columns:1.15fr .85fr;gap:55px;align-items:center}.eyebrow{color:#62d5df;text-transform:uppercase;letter-spacing:2px;font-size:12px;font-weight:800}.hero h1{font-size:clamp(42px,6vw,68px);line-height:1.02;margin:14px 0 20px;letter-spacing:-2px}.hero p{color:#c8d7e7;max-width:650px;font-size:18px}.actions{display:flex;gap:12px;flex-wrap:wrap;margin-top:28px}
.transfer{background:white;color:var(--ink);padding:24px;border-radius:22px;box-shadow:0 24px 60px #0004}.transfer h3{margin:0 0 18px}.field{margin:12px 0}.field label{display:block;font-size:12px;font-weight:700;color:var(--muted);margin-bottom:5px}.row{display:grid;grid-template-columns:1fr 105px;gap:8px}.field input,.field select{width:100%;padding:13px;border:1px solid var(--line);border-radius:10px;font-size:15px;background:#fbfcfe}.quote{background:#eef7ff;border-radius:12px;padding:14px;margin:15px 0;font-size:13px}.quote strong{display:block;font-size:18px;margin-top:3px}
section{padding:78px 0}.section-head{text-align:center;max-width:720px;margin:0 auto 38px}.section-head h2{font-size:36px;margin:0 0 10px;letter-spacing:-1px}.section-head p{color:var(--muted)}.grid{display:grid;grid-template-columns:repeat(3,1fr);gap:20px}.card{background:var(--card);border:1px solid var(--line);border-radius:var(--radius);padding:26px}.icon{width:44px;height:44px;border-radius:12px;background:#e9f3ff;display:grid;place-items:center;color:var(--blue);font-weight:900;margin-bottom:15px}.card h3{margin:5px 0 8px}.card p{margin:0;color:var(--muted);font-size:14px}
.band{background:white}.steps{counter-reset:step}.step{position:relative;padding-left:62px}.step:before{counter-increment:step;content:counter(step);position:absolute;left:0;top:0;width:40px;height:40px;border-radius:50%;background:var(--blue);color:#fff;display:grid;place-items:center;font-weight:800}.rate{display:flex;justify-content:space-between;border-bottom:1px solid var(--line);padding:14px 0}.rate:last-child{border:0}.faq{max-width:800px;margin:auto}.faq details{background:white;border:1px solid var(--line);border-radius:12px;padding:17px 20px;margin:10px 0}.faq summary{font-weight:700;cursor:pointer}.contact{background:var(--navy);color:white}.contact p{color:#b9c9db}.contact-grid{display:grid;grid-template-columns:1fr 1fr;gap:50px}.contact input,.contact textarea{width:100%;padding:13px;margin:7px 0;border-radius:9px;border:1px solid #3d5671;background:#102b4b;color:white}.contact textarea{min-height:120px}footer{background:#061426;color:#8fa4ba;padding:25px 0;font-size:13px}.footer-row{display:flex;justify-content:space-between;gap:20px}
.notice{font-size:12px;color:var(--muted);margin-top:10px}
@media(max-width:850px){nav{display:none}.hero-grid,.contact-grid{grid-template-columns:1fr}.grid{grid-template-columns:1fr}.hero{padding-top:55px}.hero h1{font-size:45px}section{padding:58px 0}}
</style>
</head>
<body>
<header><div class="container nav">
<a class="logo" href="#home">Cash<span>ex</span></a>
<nav><a href="#services">Services</a><a href="#rates">Rates</a><a href="#how">How It Works</a><a href="#security">Security</a><a href="#faq">FAQ</a><a href="#contact">Contact</a></nav>
<a class="btn btn-primary" href="#transfer">Start Transfer</a>
</div></header>

<main id="home">
<section class="hero"><div class="container hero-grid">
<div><div class="eyebrow">Worldwide money transfer</div><h1>Send money worldwide. Simply.</h1><p>Cashex Smart Transfer is designed to make international and local money transfers clear, fast and easy, with currency information, transfer tracking and digital confirmation.</p>
<div class="actions"><a class="btn btn-primary" href="#transfer">Send Money</a><a class="btn btn-outline" href="#how">How it works</a></div></div>
<div class="transfer" id="transfer"><h3>Transfer calculator</h3>
<div class="field"><label>You send</label><div class="row"><input id="amount" type="number" value="1000" min="0"><select id="from"><option>USD</option><option>EUR</option><option>GBP</option><option>PKR</option><option>AED</option></select></div></div>
<div class="field"><label>Recipient receives</label><div class="row"><input id="receive" value="278500" readonly><select id="to"><option>PKR</option><option>USD</option><option>EUR</option><option>GBP</option><option>AED</option></select></div></div>
<div class="quote">Indicative exchange rate<strong id="rateText">1 USD = 278.50 PKR</strong>Rates shown here are demonstration values and should be connected to a live rate provider before launch.</div>
<a class="btn btn-primary" style="width:100%;text-align:center" href="#contact">Continue Transfer</a>
<div class="notice">Actual transfers require appropriate payment, banking and regulatory integrations.</div>
</div></div></section>


<section id="services"><div class="container"><div class="section-head"><h2>Transfer services built around you</h2><p>One platform for common local and international transfer workflows.</p></div>
<div class="grid">
<div class="card"><div class="icon">↔</div><h3>Bank-to-bank transfers</h3><p>Send funds to supported local or international bank accounts through integrated payment providers.</p></div>
<div class="card"><div class="icon">V</div><h3>Visa & Mastercard</h3><p>Support eligible card-based transfer workflows through compliant card and payment integrations.</p></div>
<div class="card"><div class="icon">◎</div><h3>Multiple currencies</h3><p>View supported currencies and exchange information before confirming a transfer.</p></div>
<div class="card"><div class="icon">⚡</div><h3>Fast processing</h3><p>Provide a clear transfer journey with status updates and processing notifications.</p></div>
<div class="card"><div class="icon">✓</div><h3>Verification reports</h3><p>Give users digital transaction confirmations and verification records for completed transfers.</p></div>
<div class="card"><div class="icon">#</div><h3>Transfer tracking</h3><p>Let customers check transfer status and review their transaction history from their account.</p></div>
</div></div></section>

<section class="band" id="how"><div class="container"><div class="section-head"><h2>How Smart Transfer works</h2><p>A straightforward flow from quote to confirmation.</p></div>
<div class="grid steps"><div class="card step"><h3>Create an account</h3><p>Register and complete the required identity and account verification steps.</p></div><div class="card step"><h3>Enter transfer details</h3><p>Select currencies, amount, recipient and an available transfer method.</p></div><div class="card step"><h3>Review & confirm</h3><p>Review the applicable exchange rate, fees and recipient information before confirmation.</p></div><div class="card step"><h3>Track the transfer</h3><p>Follow the transaction status and receive updates as the transfer progresses.</p></div><div class="card step"><h3>Receive confirmation</h3><p>Access a digital confirmation or verification report in your account.</p></div><div class="card step"><h3>Review history</h3><p>Keep an organized record of previous transfers and transaction details.</p></div></div></div></section>

<section id="rates"><div class="container"><div class="section-head"><h2>Exchange rates</h2><p>Show current rates clearly so customers can understand their transfer before they send.</p></div>
<div class="card" style="max-width:700px;margin:auto"><div class="rate"><strong>USD → PKR</strong><span>278.50</span></div><div class="rate"><strong>EUR → USD</strong><span>1.17</span></div><div class="rate"><strong>GBP → USD</strong><span>1.35</span></div><div class="rate"><strong>AED → USD</strong><span>0.2723</span></div><p class="notice">Illustrative rates only. Connect Smart Transfer to a live exchange-rate source and configure your applicable fees before production use.</p></div></div></section>

<section class="band" id="security"><div class="container"><div class="section-head"><h2>Security & verification</h2><p>Build customer confidence with a transparent and security-focused transfer experience.</p></div>
<div class="grid"><div class="card"><div class="icon">ID</div><h3>Account verification</h3><p>Support identity and account verification workflows appropriate to the service and applicable requirements.</p></div><div class="card"><div class="icon">🔒</div><h3>Secure sessions</h3><p>Use secure authentication, encrypted connections and appropriate protection for customer information.</p></div><div class="card"><div class="icon">✓</div><h3>Transaction records</h3><p>Provide receipts, status history and verification reports for eligible transactions.</p></div></div></div></section>

<section id="faq"><div class="container"><div class="section-head"><h2>Frequently asked questions</h2></div><div class="faq">
<details><summary>Which currencies will Smart Transfer support?</summary><p>The production platform can list the currencies enabled through its payment and banking partners. The calculator currently demonstrates several common currencies.</p></details>
<details><summary>Can customers transfer to Visa or Mastercard?</summary><p>Eligible card transfer functionality can be offered where supported by the connected card/payment provider and applicable rules.</p></details>
<details><summary>Will customers be able to track transfers?</summary><p>Yes. The planned account area includes transfer status, history and digital confirmation records.</p></details>
<details><summary>Are the exchange rates live?</summary><p>The demonstration calculator is not live. A production version should connect to a reliable exchange-rate provider and clearly display the applicable rate and fees.</p></details>
</div></div></section>

<section class="contact" id="contact"><div class="container contact-grid"><div><div class="eyebrow">Get started</div><h2>Ready to build Smart Transfer?</h2><p>Connect your payment, banking, compliance and exchange-rate providers to turn this front-end experience into a production money-transfer platform.</p><a class="btn btn-primary" href="#home">Back to top</a></div>
<form onsubmit="event.preventDefault();alert('Thank you. Your request has been captured for this demo.');"><input required placeholder="Full name"><input required type="email" placeholder="Email address"><input placeholder="Phone number"><textarea placeholder="How can we help?"></textarea><button class="btn btn-primary" type="submit">Send Request</button></form></div></section>
</main>
<footer><div class="container footer-row"><div>© 2026 Cashex Smart Transfer. All rights reserved.</div><div>Terms · Privacy · Compliance</div></div></footer>
<script>
const amount=document.getElementById('amount'),receive=document.getElementById('receive'),from=document.getElementById('from'),to=document.getElementById('to'),rateText=document.getElementById('rateText');
function calc(){let a=Number(amount.value)||0;let f=from.value,t=to.value;let rates={USD:1,EUR:1.17,GBP:1.35,AED:.2723,PKR:1/278.5};let r=(rates[f]&&rates[t])?rates[f]/rates[t]:1;receive.value=(a*r).toFixed(2);rateText.textContent=`1 ${f} = ${r.toFixed(4)} ${t}`;}
[amount,from,to].forEach(x=>x.addEventListener('input',calc));calc();
</script>
</body>
</html>