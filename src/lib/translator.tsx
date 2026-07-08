import { useEffect } from "react";
import { useApp } from "@/lib/store";

// Comprehensive EN → HI dictionary for PellingCab UI strings.
// Keys are the exact trimmed English text as it appears in the DOM.
export const HI: Record<string, string> = {
  // Nav / chrome
  "Home": "होम",
  "Trips": "यात्राएँ",
  "Support": "सहायता",
  "Profile": "प्रोफ़ाइल",
  "Shuttle": "शटल",
  "Me": "मैं",
  "PellingCab": "पेलिंगकैब",
  "About": "हमारे बारे में",
  "Contact": "संपर्क",
  "Settings": "सेटिंग्स",
  "Vehicles": "वाहन",
  "My trips": "मेरी यात्राएँ",
  "Sign in": "साइन इन",
  "Company": "कंपनी",
  "Booking": "बुकिंग",

  // Home / hero
  "Chauffeured Luxury": "चालक-सहित लक्ज़री",
  "Book a seat": "सीट बुक करें",
  "Rent a cab": "कैब किराए पर लें",
  "Pelling ⇄ Bagdogra": "पेलिंग ⇄ बागडोगरा",
  "Share the ride, split the fare — scheduled shuttle departures on our most-loved routes.":
    "सवारी साझा करें, किराया बाँटें — हमारे लोकप्रिय मार्गों पर निर्धारित शटल प्रस्थान।",
  "Private chauffeur, from ₹1,499.": "निजी चालक, ₹1,499 से।",
  "Transparent fares": "पारदर्शी किराया",
  "See taxes and totals before you pay. No surge, no surprises.":
    "भुगतान से पहले कर और कुल देखें। कोई सर्ज नहीं, कोई आश्चर्य नहीं।",
  "Verified chauffeurs": "प्रमाणित चालक",
  "Trained, background-verified chauffeur": "प्रशिक्षित, पृष्ठभूमि-प्रमाणित चालक",
  "Concierge support": "कंसीयर्ज सहायता",
  "Talk to a real person any hour of the day, in English or Hindi.":
    "दिन के किसी भी समय, अंग्रेज़ी या हिंदी में असली व्यक्ति से बात करें।",
  "Live status": "लाइव स्थिति",
  "Watch your shuttle arrive in real time with our status timeline.":
    "हमारी स्टेटस टाइमलाइन से अपनी शटल को रीयल टाइम में आते देखें।",
  "Flexible cancellation.": "लचीला रद्दीकरण।",
  "Book your first ride": "अपनी पहली सवारी बुक करें",

  // Shuttle flow
  "Book a seat · PellingCab Shuttle": "सीट बुक करें · पेलिंगकैब शटल",
  "Pick a route": "मार्ग चुनें",
  "Pick a date & departure": "तिथि व प्रस्थान चुनें",
  "Passenger details": "यात्री विवरण",
  "Pick your seat(s)": "अपनी सीट चुनें",
  "Pick a departure time": "प्रस्थान समय चुनें",
  "Departure": "प्रस्थान",
  "Travel date": "यात्रा तिथि",
  "Change route or time": "मार्ग या समय बदलें",
  "Trip details": "यात्रा विवरण",
  "Trip details saved": "यात्रा विवरण सहेजे गए",
  "Continue": "आगे बढ़ें",
  "Continue to seats": "सीटों पर जाएँ",
  "Pick a route to see today's departures.": "आज के प्रस्थान देखने के लिए मार्ग चुनें।",
  "You'll pick individual seats in the next step. Book multiple to travel with family.":
    "अगले चरण में आप सीटें चुनेंगे। परिवार के साथ यात्रा के लिए कई सीटें बुक करें।",

  // Vehicles / booking
  "Choose your ride · PellingCab": "अपनी सवारी चुनें · पेलिंगकैब",
  "Book your ride · PellingCab": "अपनी सवारी बुक करें · पेलिंगकैब",
  "Trip type": "यात्रा प्रकार",
  "Half day": "आधे दिन",
  "Full day": "पूरे दिन",
  "Half-Day Rental": "आधे दिन का किराया",
  "Full-Day Rental": "पूरे दिन का किराया",
  "Pickup": "पिकअप",
  "Pickup location": "पिकअप स्थान",
  "Pickup date": "पिकअप तिथि",
  "Pickup time": "पिकअप समय",
  "Destination": "गंतव्य",
  "Date & time": "तिथि व समय",
  "Full name": "पूरा नाम",
  "Phone number": "फ़ोन नंबर",
  "Email": "ईमेल",
  "Phone": "फ़ोन",
  "Seats": "सीटें",
  "Luggage": "सामान",
  "AC": "एसी",
  "Additional notes (optional)": "अतिरिक्त नोट्स (वैकल्पिक)",
  "Anything we should know?": "कुछ जो हमें बताना चाहेंगे?",
  "Select a vehicle": "वाहन चुनें",
  "Select a route to see fare and vehicle details.": "किराया और वाहन देखने के लिए मार्ग चुनें।",
  "All-inclusive chauffeur · Fuel · Tolls extra": "सर्व-समावेशी चालक · ईंधन · टोल अतिरिक्त",
  "Sanitised, insured premium vehicle": "सैनिटाइज़्ड, बीमित प्रीमियम वाहन",
  "Bottled water & phone charger": "बोतलबंद पानी व फ़ोन चार्जर",
  "Tell us where and when — we'll match a chauffeur.": "बताएँ कहाँ और कब — हम चालक तय करेंगे।",

  // Seats
  "Choose your seats": "अपनी सीट चुनें",
  "Available": "उपलब्ध",
  "Occupied": "बुक्ड",
  "Selected": "चुनी हुई",
  "Green seats are free, gold are yours. Book multiple to travel with family.":
    "हरी सीटें खाली हैं, सुनहरी आपकी हैं। परिवार के साथ यात्रा के लिए कई बुक करें।",

  // Summary / payment
  "Booking summary · PellingCab": "बुकिंग सारांश · पेलिंगकैब",
  "Booking summary": "बुकिंग सारांश",
  "Review your trip and pick your seats.": "अपनी यात्रा देखें और सीटें चुनें।",
  "Fare": "किराया",
  "Taxes": "कर",
  "Taxes & fees": "कर व शुल्क",
  "Taxes & fees (18%)": "कर व शुल्क (18%)",
  "Total": "कुल",
  "Total paid": "कुल भुगतान",
  "per trip": "प्रति यात्रा",
  "Pay now": "अभी भुगतान करें",
  "Payment": "भुगतान",
  "Payment · PellingCab": "भुगतान · पेलिंगकैब",
  "Choose a method. All transactions are 256-bit encrypted.":
    "एक विधि चुनें। सभी लेन-देन 256-बिट एन्क्रिप्टेड हैं।",
  "UPI": "यूपीआई",
  "Card": "कार्ड",
  "Net Banking": "नेट बैंकिंग",
  "Wallets": "वॉलेट",
  "Cash": "नकद",
  "QR Code": "क्यूआर कोड",
  "Scan to pay": "भुगतान के लिए स्कैन करें",
  "Your UPI ID": "आपकी यूपीआई आईडी",
  "name@bank": "name@bank",
  "PhonePe, GPay, Paytm": "फ़ोनपे, जीपे, पेटीएम",
  "Card number": "कार्ड नंबर",
  "MM/YY": "MM/YY",
  "CVV": "सीवीवी",
  "Visa · Master · Rupay": "वीज़ा · मास्टर · रूपे",
  "HDFC Bank": "एचडीएफसी बैंक",
  "ICICI Bank": "आईसीआईसीआई बैंक",
  "Axis Bank": "एक्सिस बैंक",
  "Kotak": "कोटक",
  "SBI": "एसबीआई",
  "Paytm": "पेटीएम",
  "Amazon Pay": "अमेज़न पे",
  "Mobikwik": "मोबिक्विक",
  "Pay driver in cash": "चालक को नकद भुगतान करें",
  "Confirm cash payment": "नकद भुगतान की पुष्टि करें",
  "I've paid": "मैंने भुगतान किया",
  "Payment successful": "भुगतान सफल",
  "Payment failed. Try another method.": "भुगतान विफल। दूसरी विधि आज़माएँ।",

  // Success
  "Booking confirmed · PellingCab": "बुकिंग पक्की · पेलिंगकैब",
  "Booking ID": "बुकिंग आईडी",
  "Paid": "भुगतान",
  "Track ride": "सवारी ट्रैक करें",
  "Return home": "घर लौटें",
  "Invoice": "इनवॉइस",
  "Invoice downloaded": "इनवॉइस डाउनलोड हुआ",
  "Booking link copied": "बुकिंग लिंक कॉपी हो गया",

  // History / trip
  "Trip history · PellingCab": "यात्रा इतिहास · पेलिंगकैब",
  "Trip history": "यात्रा इतिहास",
  "All your PellingCab bookings.": "आपकी सभी पेलिंगकैब बुकिंग।",
  "View all past bookings": "पिछली सभी बुकिंग देखें",
  "You don't have any bookings yet.": "आपकी अभी कोई बुकिंग नहीं है।",
  "No recent booking": "कोई हालिया बुकिंग नहीं",
  "Booking details · PellingCab": "बुकिंग विवरण · पेलिंगकैब",
  "Trip status": "यात्रा स्थिति",
  "Completed": "पूर्ण",
  "In progress": "जारी",
  "Pending": "लंबित",
  "Cancel": "रद्द करें",
  "Cancellation status": "रद्दीकरण स्थिति",
  "Cancellation submitted": "रद्दीकरण भेजा गया",

  // Driver / tracking
  "Driver & Vehicle · PellingCab": "चालक व वाहन · पेलिंगकैब",
  "Meet your chauffeur.": "अपने चालक से मिलें।",
  "Live tracking · PellingCab": "लाइव ट्रैकिंग · पेलिंगकैब",
  "Track": "ट्रैक",
  "Call us": "हमें कॉल करें",
  "Chat": "चैट",

  // Profile / settings
  "Profile · PellingCab": "प्रोफ़ाइल · पेलिंगकैब",
  "Manage your traveller details.": "अपने यात्री विवरण प्रबंधित करें।",
  "Manage cards & UPI": "कार्ड व यूपीआई प्रबंधित करें",
  "Aarav Kapoor": "आरव कपूर",
  "Customer": "ग्राहक",
  "Settings · PellingCab": "सेटिंग्स · पेलिंगकैब",
  "Language, notifications, privacy": "भाषा, सूचनाएँ, गोपनीयता",
  "Language": "भाषा",
  "Pick the language for menus and notifications.": "मेनू व सूचनाओं की भाषा चुनें।",
  "English": "अंग्रेज़ी",
  "EN": "EN",
  "Trip updates, offers, and reminders.": "यात्रा अपडेट, ऑफ़र और रिमाइंडर।",
  "Manage saved data on this device.": "इस डिवाइस पर सहेजा डेटा प्रबंधित करें।",
  "Local data cleared. Reload to reset.": "स्थानीय डेटा साफ़। रीसेट के लिए रीलोड करें।",
  "Privacy": "गोपनीयता",

  // Support / feedback / login / about
  "Support · PellingCab": "सहायता · पेलिंगकैब",
  "We answer in under 2 minutes, 24/7.": "हम 2 मिनट से कम में उत्तर देते हैं, 24/7।",
  "Send message": "संदेश भेजें",
  "Tell us more": "और बताएँ",
  "Message sent. We'll reply shortly.": "संदेश भेजा गया। हम जल्द उत्तर देंगे।",
  "Rate your trip · PellingCab": "अपनी यात्रा रेट करें · पेलिंगकैब",
  "How was your ride?": "आपकी सवारी कैसी थी?",
  "What went well? What could be better?": "क्या अच्छा था? क्या बेहतर हो सकता है?",
  "Rate trip": "यात्रा रेट करें",
  "Your feedback keeps chauffeurs at their best.": "आपकी प्रतिक्रिया चालकों को सर्वश्रेष्ठ रखती है।",
  "Thanks for the feedback ✨": "प्रतिक्रिया के लिए धन्यवाद ✨",
  "Sign in · PellingCab": "साइन इन · पेलिंगकैब",
  "Sign in to see your bookings and speed up checkout.":
    "अपनी बुकिंग देखने व तेज़ चेकआउट के लिए साइन इन करें।",
  "Send OTP": "ओटीपी भेजें",
  "OTP sent": "ओटीपी भेजा गया",
  "About · PellingCab": "हमारे बारे में · पेलिंगकैब",
  "A quiet obsession with great rides.": "बेहतरीन सवारी के प्रति शांत जुनून।",
  "PellingCab is a premium chauffeur-driven car rental service across India.":
    "पेलिंगकैब भारत भर में एक प्रीमियम चालक-सहित कार किराया सेवा है।",

  // Refund / cancellation
  "Cancel shuttle · PellingCab": "शटल रद्द करें · पेलिंगकैब",
  "Cancel your shuttle": "अपनी शटल रद्द करें",
  "Select a trip to see your refund estimate.": "रिफ़ंड अनुमान देखने के लिए यात्रा चुनें।",
  "Nothing to cancel": "रद्द करने को कुछ नहीं",
  "Reason for cancellation": "रद्द करने का कारण",
  "Wrong pickup time": "गलत पिकअप समय",
  "Flight rescheduled / cancelled": "उड़ान पुनर्निर्धारित / रद्द",
  "Driver / vehicle issue": "चालक / वाहन समस्या",
  "Found alternative transport": "वैकल्पिक परिवहन मिला",
  "Other": "अन्य",
  "Under an hour to departure": "प्रस्थान में एक घंटे से कम",
  "Departure time has passed": "प्रस्थान समय बीत चुका है",
  "Review the refund policy before you confirm — cancellations closer to departure receive less back.":
    "पुष्टि से पहले रिफ़ंड नीति देखें — प्रस्थान के करीब रद्दीकरण पर कम रिफ़ंड।",

  // Misc buttons / status
  "Yes": "हाँ",
  "or": "या",
  "To": "तक",
  "From": "से",
  "from": "से",
  "seat": "सीट",
  "Order": "ऑर्डर",
  "Pick a date": "तिथि चुनें",
  "Trip details · PellingCab": "यात्रा विवरण · पेलिंगकैब",
  "PellingCab · Shared shuttle & premium chauffeur travel":
    "पेलिंगकैब · साझा शटल व प्रीमियम चालक यात्रा",
  "Enter a valid email": "मान्य ईमेल दर्ज करें",
  "Enter a valid phone": "मान्य फ़ोन दर्ज करें",
  "Please enter your name": "कृपया अपना नाम दर्ज करें",
  "Destination required": "गंतव्य आवश्यक",
  "Please fix the highlighted fields": "कृपया चिह्नित फ़ील्ड ठीक करें",
  "Agra Fort": "आगरा किला",
  "None yet": "अभी कोई नहीं",
};

const ATTRS = ["placeholder", "aria-label", "title", "alt"] as const;

function translateText(en: string): string | null {
  const key = en.trim();
  if (!key) return null;
  const hi = HI[key];
  if (!hi) return null;
  // preserve leading/trailing whitespace
  const lead = en.match(/^\s*/)?.[0] ?? "";
  const trail = en.match(/\s*$/)?.[0] ?? "";
  return lead + hi + trail;
}

export function Translator() {
  const lang = useApp((s) => s.lang);

  useEffect(() => {
    if (typeof document === "undefined") return;
    // originals cache
    const textOrig = new WeakMap<Text, string>();
    const attrOrig = new WeakMap<Element, Map<string, string>>();
    let observer: MutationObserver | null = null;
    let writing = false;

    function processText(node: Text) {
      if (writing) return;
      if (!node.data) return;
      const parent = node.parentElement;
      if (!parent) return;
      const tag = parent.tagName;
      if (tag === "SCRIPT" || tag === "STYLE" || tag === "NOSCRIPT") return;

      if (lang === "hi") {
        const original = textOrig.get(node) ?? node.data;
        const translated = translateText(original);
        if (translated && translated !== node.data) {
          textOrig.set(node, original);
          writing = true;
          node.data = translated;
          writing = false;
        }
      } else {
        const original = textOrig.get(node);
        if (original && original !== node.data) {
          writing = true;
          node.data = original;
          writing = false;
          textOrig.delete(node);
        }
      }
    }

    function processAttrs(el: Element) {
      for (const attr of ATTRS) {
        const cur = el.getAttribute(attr);
        if (cur == null) continue;
        let store = attrOrig.get(el);
        if (lang === "hi") {
          const original = store?.get(attr) ?? cur;
          const translated = translateText(original);
          if (translated && translated !== cur) {
            if (!store) { store = new Map(); attrOrig.set(el, store); }
            store.set(attr, original);
            writing = true;
            el.setAttribute(attr, translated);
            writing = false;
          }
        } else if (store?.has(attr)) {
          const original = store.get(attr)!;
          if (original !== cur) {
            writing = true;
            el.setAttribute(attr, original);
            writing = false;
          }
          store.delete(attr);
        }
      }
    }

    function walk(root: Node) {
      if (root.nodeType === Node.TEXT_NODE) {
        processText(root as Text);
        return;
      }
      if (root.nodeType !== Node.ELEMENT_NODE) return;
      processAttrs(root as Element);
      const w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT);
      let n: Node | null;
      while ((n = w.nextNode())) {
        if (n.nodeType === Node.TEXT_NODE) processText(n as Text);
        else processAttrs(n as Element);
      }
    }

    walk(document.body);

    observer = new MutationObserver((mutations) => {
      if (writing) return;
      for (const m of mutations) {
        if (m.type === "characterData" && m.target.nodeType === Node.TEXT_NODE) {
          processText(m.target as Text);
        } else if (m.type === "attributes" && m.target.nodeType === Node.ELEMENT_NODE) {
          processAttrs(m.target as Element);
        } else if (m.type === "childList") {
          m.addedNodes.forEach(walk);
        }
      }
    });
    observer.observe(document.body, {
      subtree: true,
      childList: true,
      characterData: true,
      attributes: true,
      attributeFilter: [...ATTRS],
    });

    return () => {
      observer?.disconnect();
    };
  }, [lang]);

  return null;
}
