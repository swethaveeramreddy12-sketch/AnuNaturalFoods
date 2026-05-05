const WHATSAPP_NUMBER = "919642333337";
const WHATSAPP_MESSAGE = "Hi Anunatural Foods, I'd like to know more about your mangoes.";

const WhatsAppButton = () => (
  <a
    href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`}
    target="_blank"
    rel="noopener noreferrer"
    aria-label="Chat with us on WhatsApp"
    className="fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-full bg-[#25D366] px-4 py-3 text-white shadow-lg transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#25D366]/60"
  >
    {/* Official WhatsApp glyph */}
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 32 32"
      className="h-6 w-6"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M19.11 17.21c-.29-.15-1.7-.84-1.96-.94-.26-.1-.45-.15-.64.15-.19.29-.74.94-.9 1.13-.17.19-.33.21-.62.07-.29-.15-1.22-.45-2.32-1.43-.86-.77-1.44-1.72-1.61-2.01-.17-.29-.02-.45.13-.6.13-.13.29-.34.43-.51.14-.17.19-.29.29-.48.1-.19.05-.36-.02-.51-.07-.15-.64-1.55-.88-2.12-.23-.55-.46-.48-.64-.49l-.55-.01c-.19 0-.5.07-.76.36-.26.29-1 .98-1 2.39 0 1.41 1.02 2.77 1.16 2.96.14.19 2.01 3.07 4.87 4.31.68.29 1.21.46 1.62.59.68.22 1.3.19 1.79.12.55-.08 1.7-.69 1.94-1.36.24-.67.24-1.24.17-1.36-.07-.12-.26-.19-.55-.34zM16.04 5.33c-5.91 0-10.71 4.79-10.71 10.7 0 1.89.5 3.74 1.44 5.36L5.33 26.67l5.43-1.42a10.7 10.7 0 0 0 5.27 1.37h.01c5.9 0 10.7-4.79 10.7-10.7s-4.8-10.59-10.7-10.59zm6.24 16.83a8.86 8.86 0 0 1-6.24 2.58h-.01c-1.59 0-3.15-.43-4.51-1.24l-.32-.19-3.34.87.89-3.26-.21-.34a8.84 8.84 0 0 1-1.36-4.74c0-4.89 3.99-8.87 8.87-8.87 2.37 0 4.59.92 6.27 2.6a8.79 8.79 0 0 1 2.6 6.27c0 4.89-3.99 8.87-8.64 8.32z"/>
    </svg>
    <span className="hidden text-sm font-semibold sm:inline">Chat on WhatsApp</span>
  </a>
);

export default WhatsAppButton;
