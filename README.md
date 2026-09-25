<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Dashboard | Cashex</title>
  <style>
    :root{--navy:#081b33;--blue:#1769e0;--ink:#10243d;--muted:#63748a;--bg:#f5f8fc;--card:#fff;--line:#e5ebf3;--danger:#b42318;--radius:18px}
    *{box-sizing:border-box} body{margin:0;font-family:Inter,system-ui,-apple-system,Segoe UI,Arial,sans-serif;color:var(--ink);background:var(--bg);line-height:1.6} a{text-decoration:none;color:inherit}.container{max-width:1100px;margin:0 auto;padding:0 22px}
    header{background:rgba(8,27,51,.96);color:#fff}.nav{height:76px;display:flex;align-items:center;justify-content:space-between}.logo{font-size:22px;font-weight:800;letter-spacing:-.5px}.logo span{color:#35c4d5}.button{display:inline-block;padding:12px 18px;border-radius:10px;font:inherit;font-weight:800;cursor:pointer;border:1px solid transparent;background:#fff;color:var(--ink);border-color:var(--line)}
    main{padding:48px 0}.grid{display:grid;grid-template-columns:1.2fr 0.8fr;gap:22px}.card{background:var(--card);border:1px solid var(--line);border-radius:18px;padding:28px;box-shadow:0 18px 45px rgba(25,59,101,.08)}h1{margin:0 0 8px;font-size:38px}.sub{margin:0 0 25px;color:var(--muted)}.stat{display:flex;justify-content:space-between;padding:14px 0;border-bottom:1px solid var(--line);font-size:15px}.stat:last-child{border-bottom:none}.muted{color:var(--muted)}
    .logout{background:var(--blue);color:#fff;border-color:var(--blue)}
  </style>
</head>
<body>
  <header>
    <div class="container nav">
      <a class="logo" href="index.html">Cash<span>ex</span></a>
      <button class="button logout" id="logout-button" type="button">Log out</button>
    </div>
  </header>

  <main>
    <div class="container grid">
      <section class="card">
        <h1>Welcome to your dashboard</h1>
        <p class="sub">Your Cashex account is active.</p>

        <div class="stat"><span>Account status</span><strong>Verified</strong></div>
        <div class="stat"><span>Available balance</span><strong>$0.00</strong></div>
        <div class="stat"><span>Last transfer</span><strong>No transfers yet</strong></div>
      </section>

      <aside class="card">
        <h2>Quick actions</h2>
        <p class="muted">Secure account workflow is ready for your live backend.</p>
        <div style="display:grid;gap:12px;margin-top:18px;">
          <a class="button" href="index.html">Back to home</a>
          <a class="button" href="signup.html">Create another account</a>
        </div>
      </aside>
    </div>
  </main>

  <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
  <script src="supabase-config.js"></script>
  <script>
    const logoutButton = document.getElementById('logout-button');

    const config = window.CASHEXC_CONFIG || {};
    const supabaseUrl = config.supabaseUrl;
    const supabaseAnonKey = config.supabaseAnonKey;

    if (!supabaseUrl || !supabaseAnonKey || supabaseUrl.includes('YOUR_') || supabaseAnonKey.includes('YOUR_')) {
      document.body.insertAdjacentHTML('beforeend', '<div style="padding:18px 22px;color:#b42318;">Configure your Supabase URL and anon key in supabase-config.js to enable real authentication.</div>');
    }

    logoutButton.addEventListener('click', async () => {
      const supabase = window.supabase.createClient(supabaseUrl, supabaseAnonKey);
      await supabase.auth.signOut();
      window.location.href = 'login.html';
    });
  </script>
</body>
</html>













































































































