const Footer = () => {
  return (
    <footer className="bg-dark text-white text-center py-3 mt-auto">
      <div className="container">
        <small>
          &copy; {new Date().getFullYear()} The Show App. All rights reserved.
        </small>
      </div>
    </footer>
  );
};

export default Footer;
