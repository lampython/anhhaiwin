import React, { useState, useEffect, useRef } from "react";
import * as OTPAuth from "otpauth";
import { 
  KeyRound, 
  Heart, 
  Copy, 
  Check, 
  Download, 
  Code, 
  Info, 
  RefreshCw, 
  Facebook, 
  ShoppingBag, 
  Video, 
  Smartphone,
  Sparkles,
  Search,
  ExternalLink,
  ChevronRight,
  HelpCircle,
  Eye,
  Settings,
  HeartHandshake
} from "lucide-react";

export default function App() {
  // 2FA Key states
  const [secretKey, setSecretKey] = useState(() => {
    return localStorage.getItem("anhhaiwin_2fa_secret") || "JBSWY3DPEHPK3PXP";
  });
  const [otpCode, setOtpCode] = useState("------");
  const [secondsRemaining, setSecondsRemaining] = useState(30);
  const [errorMsg, setErrorMsg] = useState("");
  const [copiedOtp, setCopiedOtp] = useState(false);
  const [copiedHtml, setCopiedHtml] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Social interactions & styling links
  const [shopeeUrl, setShopeeUrl] = useState("https://shopee.vn/universal-greetings");
  const [tiktokUrl, setTiktokUrl] = useState("https://www.tiktok.com/@anhhaiwin");
  const [facebookUrl, setFacebookUrl] = useState("https://facebook.com/anhhaiwin");

  // Thumbnail backgrounds customizable
  const [shopeeThumb, setShopeeThumb] = useState("https://images.unsplash.com/photo-1543087903-1ac2ec7aa8c5?auto=format&fit=crop&q=80&w=300");
  const [tiktokThumb, setTiktokThumb] = useState("https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&q=80&w=300");
  const [facebookThumb, setFacebookThumb] = useState("https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=300");

  // Counter & gamified rewards
  const [totalOtpGenerated, setTotalOtpGenerated] = useState(() => {
    return Number(localStorage.getItem("anhhaiwin_generated_count") || "12");
  });
  const [showHearts, setShowHearts] = useState<{ id: number; left: number }[]>([]);

  // Bank Info variables
  const [bankAccountName] = useState("NGUYEN HOANG DUC LAM");
  const [bankAccountNumber] = useState("0061001142207");
  const [bankName] = useState("Vietcombank");
  const [isQrError, setIsQrError] = useState(false);

  // Exporter toggle
  const [showExporterTab, setShowExporterTab] = useState(false);

  // Timer Ref
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Calculate OTP logic
  const calculateOTP = (rawSecret: string) => {
    if (!rawSecret.trim()) {
      setOtpCode("------");
      setErrorMsg("");
      return;
    }

    try {
      // Normalize string (strip whitespace, set to uppercase)
      const cleanSecret = rawSecret.replace(/\s+/g, "").toUpperCase();
      
      const totp = new OTPAuth.TOTP({
        issuer: "AnhHaiWin",
        label: "SecureTwoFactor",
        algorithm: "SHA1",
        digits: 6,
        period: 30,
        secret: OTPAuth.Secret.fromBase32(cleanSecret),
      });

      const token = totp.generate();
      const currentSeconds = 30 - Math.floor((Date.now() / 1000) % 30);
      
      setOtpCode(token.slice(0, 3) + " " + token.slice(3));
      setSecondsRemaining(currentSeconds);
      setErrorMsg("");

      // Increment statistics
      if (token !== otpCode.replace(" ", "")) {
        setTotalOtpGenerated(prev => {
          const next = prev + 1;
          localStorage.setItem("anhhaiwin_generated_count", String(next));
          return next;
        });
      }
    } catch (err) {
      setOtpCode("------");
      setErrorMsg("Secret Key không hợp lệ. Vui lòng nhập đúng định dạng Base32 (A-Z, 2-7).");
    }
  };

  // Run loop
  useEffect(() => {
    calculateOTP(secretKey);
    timerRef.current = setInterval(() => {
      calculateOTP(secretKey);
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [secretKey]);

  // Persist State
  useEffect(() => {
    localStorage.setItem("anhhaiwin_2fa_secret", secretKey);
  }, [secretKey]);

  // Copy code
  const handleCopyCode = () => {
    const codeOnly = otpCode.replace(" ", "");
    if (codeOnly === "------") return;

    navigator.clipboard.writeText(codeOnly).then(() => {
      setCopiedOtp(true);
      setTimeout(() => setCopiedOtp(false), 2000);
      
      // Spawn tiny floating hearts
      triggerHearts();
    });
  };

  // Spawn visual feedback
  const triggerHearts = () => {
    const newHearts = Array.from({ length: 8 }).map((_, i) => ({
      id: Date.now() + i,
      left: Math.random() * 80 + 10,
    }));
    setShowHearts(prev => [...prev, ...newHearts]);
    setTimeout(() => {
      setShowHearts(prev => prev.filter(h => !newHearts.find(nh => nh.id === h.id)));
    }, 3000);
  };

  // Generates complete single-file HTML for exporting
  const getStaticHtmlCode = () => {
    return `<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Trình Tạo Mã 2FA Miễn Phí - AnhHaiWin</title>
    <!-- Tailwind Engine -->
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/otpauth/9.3.6/otpauth.umd.min.js"></script>
    <!-- Google Fonts: Quicksand & Inter & JetBrains Mono -->
    <link href="https://fonts.googleapis.com/css2?family=Quicksand:wght@500;600;700&family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;700&display=swap" rel="stylesheet">
    <style>
        body {
            font-family: 'Inter', sans-serif;
            background-color: #f6faf8;
        }
        .heading-font {
            font-family: 'Quicksand', sans-serif;
        }
        .mono-font {
            font-family: 'JetBrains Mono', monospace;
        }
        /* Float Love element */
        @keyframes flowUpward {
            0% {
                transform: translateY(0) scale(0.8) rotate(0deg);
                opacity: 1;
            }
            100% {
                transform: translateY(-150px) scale(1.3) rotate(20deg);
                opacity: 0;
            }
        }
        .love-spawner {
            position: absolute;
            bottom: 0;
            pointer-events: none;
            font-size: 24px;
            animation: flowUpward 2.5s cubic-bezier(0.25, 1, 0.5, 1) forwards;
        }
    </style>
</head>
<body class="min-h-screen text-stone-800 flex flex-col justify-between">

    <!-- Floating hearts receptacle -->
    <div id="hearts-layer" class="fixed inset-0 pointer-events-none z-50"></div>

    <!-- Header / Navbar matching Duc An layout -->
    <header class="bg-white border-b border-stone-150/80 sticky top-0 z-40 shadow-xs">
        <div class="max-w-4xl mx-auto px-4 py-3.5 flex items-center justify-between">
            <div class="flex items-center gap-2">
                <span class="heading-font text-2xl font-bold text-[#32BC91]">Đức An</span>
                <span class="bg-emerald-100/80 text-emerald-800 text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider">Mã 2FA</span>
            </div>
            <nav class="hidden md:flex items-center gap-6 text-sm text-stone-500 font-medium heading-font">
                <span class="cursor-pointer hover:text-[#32BC91] transition">Giới Thiệu</span>
                <span class="cursor-pointer hover:text-[#32BC91] transition">Bộ Sưu Tập</span>
                <span class="cursor-pointer hover:text-[#32BC91] transition">Liên Hệ</span>
            </nav>
            <div class="flex items-center gap-2">
                <span class="text-xs font-semibold text-emerald-800 bg-emerald-50 px-2 py-1 rounded">Miễn Phí 100%</span>
            </div>
        </div>
    </header>

    <main class="max-w-4xl mx-auto px-4 py-8 w-full flex-grow flex flex-col gap-6">

        <!-- Banner Intro reminiscent of homepage layout -->
        <div class="bg-white rounded-3xl border border-emerald-100/60 p-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm relative overflow-hidden">
            <div class="absolute right-0 top-0 w-32 h-32 bg-[#32BC91]/5 rounded-full blur-2xl pointer-events-none"></div>
            <div class="flex-grow">
                <div class="flex items-center gap-1.5 text-xs text-[#32BC91] font-bold mb-1">
                    <span class="w-1.5 h-1.5 rounded-full bg-[#32BC91] animate-ping"></span>
                    <span>AN TOÀN • RIÊNG TƯ • NGOẠI TUYẾN</span>
                </div>
                <h2 class="heading-font text-2xl font-extrabold text-stone-900 tracking-tight">Trình Tạo 2FA Toàn Diện</h2>
                <p class="text-xs text-stone-500 max-w-lg mt-1">
                    Hỗ trợ tạo mã xác nhận 2 yếu tố cục bộ trên thiết bị của bạn. Hoàn toàn tin cậy & không thu thập bất kỳ dữ liệu cá nhân nào.
                </p>
            </div>
            <div class="shrink-0">
                <a href="#engagement-hub" class="heading-font inline-flex items-center gap-1 text-xs text-white bg-[#32BC91] hover:bg-[#2bb88a] font-bold px-4 py-2.5 rounded-xl transition">
                    Ủng Hộ Duy Trì ⚡
                </a>
            </div>
        </div>

        <!-- Main Body Grid Layout: 2FA & Donation side-by-side -->
        <div class="grid grid-cols-1 md:grid-cols-5 gap-6">
            
            <!-- Left Panel: 2FA Engine (3 cols) -->
            <div class="md:col-span-3 bg-white rounded-3xl border border-stone-200 p-6 shadow-sm flex flex-col gap-5">
                <div class="flex items-center gap-2 pb-3 border-b border-stone-100">
                    <div class="p-1.5 bg-emerald-50 text-[#32BC91] rounded-lg">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                    </div>
                    <div>
                        <h3 class="heading-font font-bold text-stone-900 text-sm">Trình giải mã OTP</h3>
                        <p class="text-[11px] text-stone-400">Thời gian thực, tự động refresh</p>
                    </div>
                </div>

                <!-- Input area -->
                <div class="flex flex-col gap-2">
                    <div class="flex justify-between items-center text-xs font-semibold text-stone-600">
                        <label for="sec-input" class="flex items-center gap-1">Khóa Bí Mật (Secret Key)</label>
                        <span class="text-[9px] bg-stone-100 text-stone-500 font-bold px-1.5 py-0.5 rounded uppercase">Base-32</span>
                    </div>
                    <div class="relative">
                        <input 
                            type="text" 
                            id="sec-input" 
                            value="${secretKey}"
                            placeholder="Dán chuỗi khóa vào đây (ví dụ: JBSWY3DPEHPK3PXP)"
                            class="w-full text-xs font-bold pl-3.5 pr-14 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#32BC91] transition-all font-mono"
                        />
                        <button id="btn-sec-clean" class="absolute right-3 top-2.5 text-[10px] text-stone-400 font-bold bg-stone-200/60 px-1.5 py-1 rounded hover:text-stone-700">Xóa</button>
                    </div>
                    <p id="err-log" class="text-[11px] text-red-500 font-semibold hidden">Chuỗi không đúng chuẩn 2FA!</p>
                </div>

                <!-- Live Output Screen -->
                <div class="bg-stone-900 text-white rounded-2xl p-5 relative overflow-hidden flex flex-col items-center justify-center min-h-[140px] text-center shadow-inner group">
                    <div class="absolute inset-0 bg-gradient-to-tr from-[#32BC91]/5 to-transparent pointer-events-none"></div>
                    <span class="text-[10px] text-stone-400 font-bold tracking-widest uppercase mb-1">MÃ XÁC THỰC HIỆN TẠI</span>
                    
                    <div id="otp-view" class="mono-font text-4xl sm:text-5xl font-black tracking-widest text-[#32BC91] py-1 cursor-pointer select-all">
                        --- ---
                    </div>

                    <button id="btn-copy-totp" class="mt-3 flex items-center gap-1 text-[10px] uppercase font-bold text-stone-300 bg-stone-800 hover:bg-stone-700 px-3.5 py-1.5 rounded-lg border border-stone-700 transition">
                        <span id="copy-text-log">Chạm để sao chép mã</span>
                    </button>

                    <!-- Down timer bar -->
                    <div class="w-full bg-stone-800 h-1 rounded-full mt-4 overflow-hidden">
                        <div id="prog-bar" class="h-full bg-[#32BC91] transition-all duration-1000 ease-linear" style="width: 100%"></div>
                    </div>
                </div>
            </div>

            <!-- Right Panel: Donate Info Card (2 cols) -->
            <div class="md:col-span-2 bg-white rounded-3xl border border-stone-200 p-6 shadow-sm flex flex-col gap-4">
                <div class="flex items-center gap-2 pb-3 border-b border-stone-100">
                    <div class="p-1.5 bg-[#32BC91]/10 text-[#32BC91] rounded-lg">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
                    </div>
                    <div>
                        <h3 class="heading-font font-bold text-stone-900 text-sm">Cám Ơn Nhà Hảo Tâm</h3>
                        <p class="text-[11px] text-stone-400">Donate ủng hộ duy trì web</p>
                    </div>
                </div>

                <!-- QR representation exactly like home page style -->
                <div class="bg-gradient-to-b from-[#f8fbf9] to-stone-50 rounded-2xl border border-stone-150 p-4 flex flex-col items-center gap-3 w-full">
                    
                    <div class="w-full flex justify-between items-center px-1">
                        <span class="text-[#32BC91] font-bold text-xs uppercase heading-font tracking-wide">VIETCOMBANK</span>
                        <span class="bg-[#32BC91]/10 text-[#32BC91] text-[8px] font-extrabold px-2 py-0.5 rounded">Napas 24/7</span>
                    </div>

                    <div class="w-36 h-36 bg-white p-1 rounded-xl border border-stone-200 flex items-center justify-center overflow-hidden shadow-sm">
                        <img 
                            id="bank-qr-img"
                            src="QR.jpg" 
                            alt="Vietcombank QR" 
                            class="w-full h-full object-contain"
                            onerror="this.onerror=null; this.src='https://img.vietqr.io/image/vietcombank-0061001142207-compact2.jpg?accountName=NGUYEN%20HOANG%20DUC%20LAM&addInfo=Ung%20ho%20cho%20AnhHaiWin';"
                        />
                    </div>

                    <div class="text-center">
                        <p class="text-[9px] uppercase tracking-wider text-stone-400">Chủ tài khoản</p>
                        <p class="text-xs font-bold text-stone-900 uppercase">NGUYEN HOANG DUC LAM</p>
                        <p class="text-[9px] uppercase tracking-wider text-stone-400 mt-1">Số tài khoản VCB</p>
                        <p class="font-bold text-[#32BC91] text-xs font-mono tracking-wider">0061001142207</p>
                    </div>
                </div>
            </div>
        </div>

        <!-- BOTTOM AREA: Compact Engagement Hub (3 squares, SMALL & REFINED, NOT larger than 2FA section above) -->
        <section id="engagement-hub" class="bg-gradient-to-br from-white to-[#fcfefe] rounded-3xl border border-emerald-100/60 p-5 shadow-sm flex flex-col gap-4">
            
            <div class="flex flex-col gap-0.5">
                <h4 class="heading-font font-bold text-stone-900 text-sm flex items-center gap-1.5">
                    <span class="p-1 bg-[#32BC91]/10 text-[#32BC91] rounded-md shrink-0">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="m12 3-1.912 5.886H3.82l4.98 3.618-1.9 5.881L12 14.767l4.982 3.618-1.9-5.881 4.98-3.618h-6.269z"/></svg>
                    </span>
                    Ủng hộ duy trì phí vận hành trang mạng anhhaiwin
                </h4>
                <p class="text-[11px] text-stone-500">
                    Hãy bấm vào các kênh truyền thông chính thức dưới đây của ADMIN để tăng tương tác tương trợ hệ thống chạy liên tục 24/7 tốt nhất!
                </p>
            </div>

            <!-- COMPACT THREE TILES GRID (Small thumbnail squares, extremely clean and non-bulky) -->
            <div class="grid grid-cols-3 gap-3">
                
                <!-- Shopee Tile -->
                <a 
                    href="${shopeeUrl}" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    onclick="triggerSplash(event)"
                    class="group relative h-20 rounded-xl overflow-hidden border border-stone-150 flex flex-col justify-end p-2 transition duration-300 hover:-translate-y-0.5 hover:shadow-xs active:translate-y-0"
                >
                    <!-- Background with zoom effect -->
                    <div class="absolute inset-0 bg-cover bg-center transition duration-500 group-hover:scale-105" style="background-image: url('${shopeeThumb}');"></div>
                    <div class="absolute inset-0 bg-gradient-to-t from-orange-600/90 via-orange-600/40 to-transparent"></div>
                    
                    <!-- Content overlay -->
                    <div class="relative z-10 flex flex-col items-start leading-tight">
                        <span class="text-[8px] bg-white/20 backdrop-blur-md px-1.5 py-0.5 rounded font-extrabold text-white tracking-wider uppercase mb-0.5">Shopee</span>
                        <span class="text-[10px] font-bold text-white uppercase heading-font tracking-tight select-none">Tương Tác</span>
                    </div>
                </a>

                <!-- TikTok Tile -->
                <a 
                    href="${tiktokUrl}" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    onclick="triggerSplash(event)"
                    class="group relative h-20 rounded-xl overflow-hidden border border-stone-150 flex flex-col justify-end p-2 transition duration-300 hover:-translate-y-0.5 hover:shadow-xs active:translate-y-0"
                >
                    <!-- Background with zoom effect -->
                    <div class="absolute inset-0 bg-cover bg-center transition duration-500 group-hover:scale-105" style="background-image: url('${tiktokThumb}');"></div>
                    <div class="absolute inset-0 bg-gradient-to-t from-stone-900/90 via-stone-900/40 to-transparent"></div>
                    
                    <!-- Content overlay -->
                    <div class="relative z-10 flex flex-col items-start leading-tight">
                        <span class="text-[8px] bg-white/20 backdrop-blur-md px-1.5 py-0.5 rounded font-extrabold text-white tracking-wider uppercase mb-0.5">TikTok</span>
                        <span class="text-[10px] font-bold text-white uppercase heading-font tracking-tight select-none">Theo Dõi</span>
                    </div>
                </a>

                <!-- Facebook Tile -->
                <a 
                    href="${facebookUrl}" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    onclick="triggerSplash(event)"
                    class="group relative h-20 rounded-xl overflow-hidden border border-stone-150 flex flex-col justify-end p-2 transition duration-300 hover:-translate-y-0.5 hover:shadow-xs active:translate-y-0"
                >
                    <!-- Background with zoom effect -->
                    <div class="absolute inset-0 bg-cover bg-center transition duration-500 group-hover:scale-105" style="background-image: url('${facebookThumb}');"></div>
                    <div class="absolute inset-0 bg-gradient-to-t from-blue-700/90 via-blue-700/40 to-transparent"></div>
                    
                    <!-- Content overlay -->
                    <div class="relative z-10 flex flex-col items-start leading-tight">
                        <span class="text-[8px] bg-white/20 backdrop-blur-md px-1.5 py-0.5 rounded font-extrabold text-white tracking-wider uppercase mb-0.5">Facebook</span>
                        <span class="text-[10px] font-bold text-white uppercase heading-font tracking-tight select-none">Kết Nối</span>
                    </div>
                </a>

            </div>
        </section>

    </main>

    <!-- Footer credit matching screenshot styling -->
    <footer class="bg-stone-100 border-t border-stone-200 mt-12 py-8 text-center text-xs text-stone-500">
        <div class="max-w-4xl mx-auto px-4 flex flex-col gap-1.5 items-center justify-center">
            <p class="font-semibold text-stone-800">© 2026 Admin AnhHaiWin Tools. Bản quyền hoàn toàn bảo mật.</p>
            <p>Sử dụng ngoại tuyến an toàn không mất phí vận hành mạng. Được tối ưu hóa cho tốc độ và bảo mật di động.</p>
        </div>
    </footer>

    <!-- Implementation core -->
    <script>
        // Routine logic
        let stateSecret = "${secretKey}";
        const secInput = document.getElementById("sec-input");
        const optView = document.getElementById("otp-view");
        const progBar = document.getElementById("prog-bar");
        const btnClear = document.getElementById("btn-sec-clean");
        const btnCopy = document.getElementById("btn-copy-totp");
        const errLog = document.getElementById("err-log");
        const hLabel = document.getElementById("copy-text-log");

        function cleanSecret(s) {
            return s.replace(/\\s+/g, "").toUpperCase();
        }

        function triggerSplash(e) {
            const hLayer = document.getElementById("hearts-layer");
            const rect = e.currentTarget.getBoundingClientRect();
            for(let i=0; i<6; i++) {
                const item = document.createElement("div");
                item.className = "love-spawner";
                item.innerText = "❤️";
                // Positions
                item.style.left = (rect.left + rect.width / 2 + (Math.random() - 0.5) * 50) + "px";
                item.style.top = (rect.top + window.scrollY) + "px";
                item.style.animationDelay = (Math.random() * 0.3) + "s";
                hLayer.appendChild(item);
                setTimeout(() => item.remove(), 2500);
            }
        }

        function processTotp() {
            const rawVal = secInput.value;
            localStorage.setItem("anhhaiwin_2fa_secret_static", rawVal);
            const cleaned = cleanSecret(rawVal);

            if(!cleaned) {
                optView.innerText = "--- ---";
                optView.className = "mono-font text-4xl sm:text-5xl font-black tracking-widest text-stone-600 py-1 cursor-pointer select-all";
                errLog.classList.add("hidden");
                progBar.style.width = "0%";
                return;
            }

            try {
                const totp = new OTPAuth.TOTP({
                    issuer: "AnhHaiWin",
                    label: "SecureTwoFactor",
                    algorithm: "SHA1",
                    digits: 6,
                    period: 30,
                    secret: OTPAuth.Secret.fromBase32(cleaned)
                });

                const code = totp.generate();
                const secondsRemaining = 30 - Math.floor((Date.now() / 1000) % 30);

                optView.innerText = code.slice(0, 3) + " " + code.slice(3);
                optView.className = "mono-font text-4xl sm:text-5xl font-black tracking-widest text-[#32BC91] py-1 cursor-pointer select-all";
                errLog.classList.add("hidden");

                // update timer
                progBar.style.width = (secondsRemaining / 30 * 100) + "%";
                hLabel.innerText = "Nhấp sao chép (còn " + secondsRemaining + "s)";
            } catch(e) {
                optView.innerText = "S-ERR!";
                optView.className = "mono-font text-4xl sm:text-5xl font-black tracking-widest text-red-500 py-1";
                errLog.classList.remove("hidden");
                progBar.style.width = "0%";
            }
        }

        // Attach inputs
        secInput.addEventListener("input", processTotp);
        btnClear.addEventListener("click", () => {
            secInput.value = "";
            processTotp();
        });

        btnCopy.addEventListener("click", () => {
            const textToCopy = optView.innerText.replace(" ", "");
            if(textToCopy === "--- ---" || textToCopy.includes("ERR")) return;

            navigator.clipboard.writeText(textToCopy).then(() => {
                const old = hLabel.innerText;
                hLabel.innerText = "✨ ĐÃ SAO CHÉP MÃ: " + textToCopy;
                setTimeout(() => {
                    hLabel.innerText = old;
                }, 1500);
            });
        });

        // Loop periodic refreshed
        const staticCached = localStorage.getItem("anhhaiwin_2fa_secret_static");
        if (staticCached) {
            secInput.value = staticCached;
        }
        processTotp();
        setInterval(processTotp, 1000);
    </script>
</body>
</html>`;
  };

  // Click on engagement support visual trigger
  const handleSupportClick = (e: React.MouseEvent, type: string) => {
    triggerHearts();
  };

  return (
    <div className="min-h-screen bg-[#F6FAF8] text-stone-850 font-sans selection:bg-emerald-100 flex flex-col justify-between">
      
      {/* Floating animation hearts overlay */}
      <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
        {showHearts.map(heart => (
          <div
            key={heart.id}
            className="absolute bottom-[-40px] text-red-500 text-3xl animate-bounce"
            style={{
              left: `${heart.left}%`,
              animation: "floatUp 2.8s cubic-bezier(0.25, 1, 0.5, 1) forwards",
            }}
          >
            ❤️
          </div>
        ))}
      </div>

      {/* Tailwind specific custom styles injections */}
      <style>{`
        @keyframes floatUp {
          0% {
            transform: translateY(0) scale(0.8) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(-110vh) scale(1.4) rotate(30deg);
            opacity: 0;
          }
        }
      `}</style>

      {/* Styled Friendly Header bar matching Duc An page screenshot */}
      <header className="bg-white border-b border-stone-150/80 sticky top-0 z-40 shadow-xs">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="font-rounded text-3xl font-bold text-[#32BC91] tracking-tight selection:bg-[#32BC91]/10">Đức An</span>
            <div className="hidden sm:flex items-center gap-2 border-l border-stone-200 pl-3">
              <span className="text-[10px] bg-emerald-50 text-[#32BC91] border border-emerald-100 font-extrabold px-2 py-0.5 rounded uppercase tracking-wider">AnhHaiWin Tools</span>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-6 text-sm text-stone-500 font-bold font-rounded">
            <a href="#intro" className="cursor-pointer hover:text-[#32BC91] transition duration-200">Giới Thiệu</a>
            <a href="#toolkit" className="cursor-pointer hover:text-[#32BC91] transition duration-250">Bộ Sưu Tập</a>
            <a href="#support-grid" className="cursor-pointer hover:text-[#32BC91] transition duration-200">Liên Hệ</a>
          </nav>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowExporterTab(!showExporterTab)}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-stone-50 hover:bg-stone-100 border border-stone-200/80 rounded-xl text-[11px] font-bold text-stone-700 transition"
            >
              <Code className="w-3.5 h-3.5 text-stone-500" />
              <span>{showExporterTab ? "Đóng Mã Code" : "Lấy File Static HTML"}</span>
            </button>
            <a 
              href="#donate-payment"
              className="text-xs text-white bg-[#32BC91] hover:bg-[#2bb88a] font-bold px-4 py-2 rounded-xl shadow-xs transition duration-200 font-rounded"
            >
              Ủng Hộ
            </a>
          </div>
        </div>
      </header>

      {/* Middle Workspace Area */}
      <main id="intro" className="max-w-4xl mx-auto px-4 sm:px-6 py-8 w-full flex-grow flex flex-col gap-6">
        
        {/* Banner with Capybara Friendly vibe layout */}
        <div className="bg-white rounded-3xl border border-[#32BC91]/10 p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm relative overflow-hidden">
          <div className="absolute right-0 top-0 w-44 h-44 bg-[#32BC91]/5 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute -left-12 -bottom-12 w-32 h-32 bg-[#32BC91]/3 rounded-full blur-2xl pointer-events-none"></div>
          
          <div className="flex-grow text-center md:text-left">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold bg-[#32BC91]/10 text-[#32BC91] border border-[#32BC91]/20">
              <span className="w-1.5 h-1.5 rounded-full bg-[#32BC91] animate-pulse"></span>
              Công cụ tạo mã 2FA không dùng Internet - Tin cậy hàng đầu Việt Nam
            </span>
            <h2 className="font-rounded text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight mt-3">
              Trình Xác Thực 2FA Miễn Phí
            </h2>
            <p className="text-xs sm:text-sm text-stone-500 mt-1.5 max-w-xl">
              An toàn tuyệt đối – Dữ liệu được mã hóa cục bộ ngay trong trình duyệt. Không có dữ liệu nào tải về máy chủ, bảo mật tuyệt hảo cho tài khoản mạng xã hội của bạn.
            </p>
          </div>

          <div className="shrink-0 flex self-center sm:self-auto gap-2">
            <button
              onClick={() => {
                const element = document.getElementById("donate-payment");
                element?.scrollIntoView({ behavior: "smooth" });
                triggerHearts();
              }}
              className="font-rounded text-xs bg-red-50 text-red-600 border border-red-100 hover:bg-red-100 transition px-4.5 py-3 rounded-2xl font-bold flex items-center gap-1"
            >
              <Heart className="w-4 h-4 text-red-500 fill-red-500 animate-pulse" />
              <span>Gửi Donate Tách Trà</span>
            </button>
          </div>
        </div>

        {/* 2FA core layout and banking payment slip */}
        <div id="toolkit" className="grid grid-cols-1 md:grid-cols-5 gap-6">

          {/* LEFT: 2FA Generator Form (3 Columns wide) */}
          <div className="md:col-span-3 bg-white rounded-3xl border border-stone-200/85 shadow-xs p-6 flex flex-col justify-between gap-5 transition duration-200">
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2.5 pb-2.5 border-b border-stone-100">
                <span className="p-2 bg-[#32BC91]/10 text-[#32BC91] rounded-xl shrink-0">
                  <KeyRound className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="font-rounded font-bold text-stone-900 text-sm">Bộ Sinh OTP Từ Khóa</h3>
                  <p className="text-[11px] text-stone-400">Hỗ trợ thuật toán SHA1 mặc định của Google Authenticator</p>
                </div>
              </div>

              {/* Secrets Input Form */}
              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between items-center text-xs font-bold text-stone-600">
                  <label htmlFor="user-secret">Nhập Mã Secret Key của bạn:</label>
                  <span className="text-[9px] bg-sky-50 text-sky-700 px-2 py-0.5 rounded border border-sky-100 font-mono">Offline-Mode</span>
                </div>
                
                <div className="relative">
                  <input
                    id="user-secret"
                    type="text"
                    value={secretKey}
                    onChange={(e) => setSecretKey(e.target.value)}
                    placeholder="Ví dụ: JBSWY3DPEHPK3PXP"
                    className="w-full text-xs font-bold pl-3.5 pr-14 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#32BC91] transition-all font-mono"
                  />
                  {secretKey && (
                    <button
                      onClick={() => {
                        setSecretKey("");
                        setOtpCode("------");
                      }}
                      className="absolute right-3.5 top-3 text-[10px] text-stone-400 hover:text-stone-600 font-bold bg-stone-200/50 hover:bg-stone-200 px-1.5 py-0.5 rounded transition"
                    >
                      Xóa
                    </button>
                  )}
                </div>
                
                {errorMsg ? (
                  <p className="text-[11px] text-red-500 font-semibold">{errorMsg}</p>
                ) : (
                  <p className="text-[10px] text-stone-400">
                    *Mã của bạn được lưu cục bộ an toàn tại LocalStorage, tự động sinh mã mỗi 30 giây.
                  </p>
                )}
              </div>

              {/* Core Output Screen Container */}
              <div className="bg-stone-950 text-stone-100 rounded-2xl p-5 relative overflow-hidden flex flex-col items-center justify-center min-h-[145px] text-center border border-stone-850 shadow-inner">
                <div className="absolute right-0 top-0 w-32 h-32 bg-[#32BC91]/5 rounded-full blur-2xl pointer-events-none"></div>
                <div className="absolute left-0 bottom-0 w-24 h-24 bg-teal-500/5 rounded-full blur-xl pointer-events-none"></div>

                <span className="text-[9px] text-stone-400 tracking-widest font-extrabold uppercase mb-1">MÃ XÁC THỰC HIỆN TẠI (OTP)</span>
                
                <div 
                  onClick={handleCopyCode}
                  className="font-mono text-4xl sm:text-5xl font-extrabold tracking-widest text-[#32BC91] py-1 select-all cursor-pointer hover:scale-103 transition-transform"
                  title="Chạm để sao chép nhanh"
                >
                  {otpCode}
                </div>

                <button
                  onClick={handleCopyCode}
                  disabled={otpCode === "------"}
                  className="mt-3 flex items-center gap-1.5 px-4 py-1.5 bg-stone-900 border border-stone-800 hover:bg-stone-850 text-[10px] tracking-wider uppercase font-extrabold rounded-lg text-stone-300 transition"
                >
                  {copiedOtp ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-[#32BC91]">ĐÃ SAO CHÉP</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-stone-400" />
                      <span>CLICK SAO CHÉP</span>
                    </>
                  )}
                </button>

                {/* Progress countdown time bar */}
                <div className="w-full bg-stone-900 h-1 rounded-full mt-4 overflow-hidden relative">
                  <div
                    className={`h-full transition-all duration-1000 ease-linear ${
                      secondsRemaining <= 5 ? "bg-red-500" : secondsRemaining <= 12 ? "bg-amber-400" : "bg-[#32BC91]"
                    }`}
                    style={{ width: `${(secondsRemaining / 30) * 100}%` }}
                  />
                </div>

                <div className="w-full flex justify-between items-center text-[9px] text-stone-500 mt-2 font-mono">
                  <span>CHỐNG DỮ LIỆU ĐĂNG NHẬP SAI</span>
                  <span className="flex items-center gap-1">
                    <RefreshCw className="w-3 h-3 text-[#32BC91] animate-spin" />
                    Đổi mã sau {secondsRemaining}s
                  </span>
                </div>
              </div>
            </div>

            {/* Micro instruction hint */}
            <div className="bg-[#32BC91]/5 border border-[#32BC91]/10 p-3 rounded-xl flex gap-2.5 text-stone-600 text-[11px]">
              <span className="w-2.5 h-2.5 rounded-full bg-[#32BC91] mt-1 shrink-0"></span>
              <p>
                <strong>Mẹo thêm:</strong> Bạn hoàn toàn có thể lưu trang này ra màn hình khóa của điện thoại như 1 phím tắt và dùng trọn đời hoàn toàn miễn phí, độc lập.
              </p>
            </div>
          </div>

          {/* RIGHT: Donation Slip (2 Columns wide) */}
          <div id="donate-payment" className="md:col-span-2 bg-white rounded-3xl border border-stone-200/85 p-6 flex flex-col gap-4">
            <div className="flex items-center gap-2 pb-2.5 border-b border-stone-100">
              <span className="p-1.5 bg-red-50 text-red-500 rounded-lg shrink-0">
                <Heart className="w-4.5 h-4.5 fill-red-400" />
              </span>
              <div>
                <h3 className="font-rounded font-bold text-stone-900 text-sm">Góc Ủng Hộ Người Thiết Kế</h3>
                <p className="text-[11px] text-stone-400">Hỗ trợ duy trì bảo trì máy chủ hàng tháng</p>
              </div>
            </div>

            {/* Bank Card Graphic */}
            <div className="bg-gradient-to-b from-[#f6faf8] to-stone-50 rounded-2xl border border-stone-150 p-4 shadow-3xs flex flex-col items-center gap-3">
              <div className="w-full flex justify-between items-center text-[#32BC91] px-1 font-rounded font-extrabold text-xs">
                <span>VIETCOMBANK</span>
                <span className="bg-[#32BC91]/10 text-[#32BC91] text-[8px] font-bold px-1.5 py-0.5 rounded uppercase">Compact 247</span>
              </div>

              {/* QR Image Area with direct Error fallback */}
              <div className="w-36 h-36 bg-white p-1 rounded-xl border border-stone-200 flex items-center justify-center overflow-hidden shadow-sm relative group">
                <img
                  src={isQrError ? "https://img.vietqr.io/image/vietcombank-0061001142207-compact2.jpg?accountName=NGUYEN%20HOANG%20DUC%20LAM&addInfo=Ung%20ho%20cho%20AnhHaiWin" : "/QR.jpg"}
                  alt="Vietcombank Donation QR Code"
                  className="w-full h-full object-contain"
                  onError={() => {
                    console.log("QR.jpg fallback to custom API endpoint!");
                    setIsQrError(true);
                  }}
                />
              </div>

              <div className="text-center">
                <span className="text-[9px] uppercase tracking-wider text-stone-450 block font-bold">Chủ Tài Khoản</span>
                <span className="text-xs font-extrabold text-stone-850 uppercase block mb-1">{bankAccountName}</span>
                <span className="text-[9px] uppercase tracking-wider text-stone-450 block font-bold">Số Tài Khoản VCB</span>
                <span className="text-sm font-bold text-[#32BC91] tracking-wider font-mono select-all block">{bankAccountNumber}</span>
              </div>
            </div>

            <p className="text-[10px] text-stone-400 text-center leading-tight">
              *Mọi khoản quyên góp quý báu của bạn đều giúp admin trả chi phí lưu trữ đám mây. Trân trọng cảm ơn!
            </p>
          </div>
        </div>

        {/* BOTTOM SECTION: Compact Engagement Hub (3 clean squares, small in vertical sizing) */}
        <section id="support-grid" className="bg-gradient-to-br from-white to-[#F9FBFB] rounded-3xl border border-[#32BC91]/10 p-5 sm:p-6 shadow-sm flex flex-col gap-3.5">
          
          <div className="flex flex-col gap-0.5">
            <h4 className="font-rounded font-bold text-stone-900 text-sm flex items-center gap-1.5">
              <span className="p-1 bg-[#32BC91]/15 text-[#32BC91] rounded-lg">
                <HeartHandshake className="w-4.5 h-4.5" />
              </span>
              Ủng hộ duy trì phí vận hành trang mạng anhhaiwin
            </h4>
            <p className="text-[11px] sm:text-xs text-stone-500">
              Không cần tốn tài chính, bạn hãy bấm vào các liên kết bên dưới để ủng hộ tăng độ tương tác và ủng hộ tinh thần kênh của ADMIN nhé!
            </p>
          </div>

          {/* Layout: 3 Squares (3 ô vuông) SMALL & REFINED (không to hơn phần 2fa xác thực) */}
          <div className="grid grid-cols-3 gap-3">
            
            {/* Shopee Support Box */}
            <a
              href={shopeeUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => handleSupportClick(e, "shopee")}
              className="group relative h-20 sm:h-22 rounded-xl overflow-hidden border border-stone-200 flex flex-col justify-end p-2 sm:p-3 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-sm"
            >
              {/* Thumbnail background overlay */}
              <div 
                className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105" 
                style={{ backgroundImage: `url('${shopeeThumb}')` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-orange-600/90 via-orange-600/50 to-transparent"></div>
              
              <div className="relative z-10 flex flex-col items-start leading-tight">
                <span className="text-[7.5px] font-mono-custom bg-white/20 backdrop-blur-xs px-1 py-0.5 rounded font-bold text-white tracking-wider uppercase mb-0.5">
                  SHOPEE
                </span>
                <span className="text-[10px] sm:text-[11px] font-extrabold text-white uppercase font-rounded tracking-tight block">
                  Tăng tương tác
                </span>
              </div>
            </a>

            {/* TikTok Support Box */}
            <a
              href={tiktokUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => handleSupportClick(e, "tiktok")}
              className="group relative h-20 sm:h-22 rounded-xl overflow-hidden border border-stone-200 flex flex-col justify-end p-2 sm:p-3 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-sm"
            >
              {/* Thumbnail background overlay */}
              <div 
                className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105" 
                style={{ backgroundImage: `url('${tiktokThumb}')` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-900/95 via-stone-900/55 to-transparent"></div>
              
              <div className="relative z-10 flex flex-col items-start leading-tight">
                <span className="text-[7.5px] font-mono-custom bg-white/20 backdrop-blur-xs px-1 py-0.5 rounded font-bold text-white tracking-wider uppercase mb-0.5">
                  TIKTOK
                </span>
                <span className="text-[10px] sm:text-[11px] font-extrabold text-white uppercase font-rounded tracking-tight block">
                  Bấm Theo Dõi
                </span>
              </div>
            </a>

            {/* Facebook Support Box */}
            <a
              href={facebookUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => handleSupportClick(e, "facebook")}
              className="group relative h-20 sm:h-22 rounded-xl overflow-hidden border border-stone-200 flex flex-col justify-end p-2 sm:p-3 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-sm"
            >
              {/* Thumbnail background overlay */}
              <div 
                className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105" 
                style={{ backgroundImage: `url('${facebookThumb}')` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-blue-700/90 via-blue-700/50 to-transparent"></div>
              
              <div className="relative z-10 flex flex-col items-start leading-tight">
                <span className="text-[7.5px] font-mono-custom bg-white/20 backdrop-blur-xs px-1 py-0.5 rounded font-bold text-white tracking-wider uppercase mb-0.5">
                  FACEBOOK
                </span>
                <span className="text-[10px] sm:text-[11px] font-extrabold text-white uppercase font-rounded tracking-tight block">
                  Báo tương tác
                </span>
              </div>
            </a>

          </div>
        </section>

        {/* Dynamic Static Exporter Display */}
        {showExporterTab && (
          <div className="bg-slate-900 text-[#32BC91] p-6 rounded-3xl border border-slate-950 flex flex-col gap-4 shadow-lg">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Code className="w-5 h-5 text-emerald-400" />
                <div>
                  <h4 className="font-rounded font-bold text-white text-sm">File Web tĩnh (1 Single File HTML)</h4>
                  <p className="text-xs text-slate-400">Trọn bộ mã nguồn đầy đủ, dán trực tiếp lên GitHub</p>
                </div>
              </div>
              <button 
                onClick={() => downloadCodeAsFile()}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 rounded-xl text-xs font-bold transition"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Tải Về File (.html)</span>
              </button>
            </div>

            <p className="text-xs text-slate-350">
              Đúng như bạn đã yêu cầu, mã nguồn dưới đây được tối ưu gói gọn trong 1 file HTML duy nhất. Hệ thống lưu trữ cục bộ, tự động xử lý và đầy đủ thư viện OTPAuth CDN. Bạn có thể sao chép nhanh:
            </p>

            <div className="relative">
              <textarea
                readOnly
                value={getStaticHtmlCode()}
                className="w-full h-64 bg-slate-950/80 text-white font-mono text-[11px] p-4 rounded-xl border border-slate-800 focus:outline-none"
              />
              <button
                onClick={() => {
                  navigator.clipboard.writeText(getStaticHtmlCode()).then(() => {
                    setCopiedHtml(true);
                    setTimeout(() => setCopiedHtml(false), 2000);
                  });
                }}
                className="absolute right-4 bottom-4 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 text-xs font-semibold rounded-lg"
              >
                {copiedHtml ? "Đã Sao Chép!" : "Sao Chép Mã"}
              </button>
            </div>
          </div>
        )}

      </main>

      {/* Styled Footer matching the aesthetics */}
      <footer className="bg-white border-t border-stone-150 py-8 text-center text-xs text-stone-500 mt-12 select-none">
        <div className="max-w-4xl mx-auto px-4 flex flex-col gap-1 items-center justify-center">
          <p className="font-extrabold text-stone-900 font-rounded">© 2026 ADMIN ANHHAIWIN. PHÂN PHỐI HOÀN TOÀN MIỄN PHÍ VÀ AN TOÀN.</p>
          <p className="text-[11px] text-stone-400">Thiết kế chuẩn hóa di động, hỗ trợ tạo mã bảo mật Totp 2FA hoàn toàn offline.</p>
        </div>
      </footer>

    </div>
  );

  // Download logic helper
  function downloadCodeAsFile() {
    const codeStr = getStaticHtmlCode();
    const dataBlob = new Blob([codeStr], { type: "text/html;charset=utf-8" });
    const localUrl = URL.createObjectURL(dataBlob);
    const hiddenLink = document.createElement("a");
    hiddenLink.href = localUrl;
    hiddenLink.download = "2fa_anhhaiwin.html";
    document.body.appendChild(hiddenLink);
    hiddenLink.click();
    document.body.removeChild(hiddenLink);
    URL.revokeObjectURL(localUrl);
  }
}
