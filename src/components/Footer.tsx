
export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="text-center mt-16 py-4 text-footer-text text-sm">
      <div className="container mx-auto px-4">
        <p>Template Generator &copy; {currentYear} | All rights reserved</p>
      </div>
    </footer>
  );
}
