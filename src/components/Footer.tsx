import React from 'react';

function Footer() {
    return (
        <footer className="bg-purple-200 p-4 text-black mt-auto fixed bottom-0 left-0 right-0">
            <div className="container mx-auto text-center">
                <p>&copy; {new Date().getFullYear()} ECTTS 2.0 . All rights reserved.</p>
                <nav>
                    <ul className="flex justify-center space-x-4 mt-2">
                        <li><a href="/" className="hover:underline">Home</a></li>
                        <li><a href="/privacy" className="hover:underline">Privacy Policy</a></li>
                        <li><a href="/contact" className="hover:underline">Contact Us</a></li>
                    </ul>
                </nav>
            </div>
        </footer>
    );
}

export default Footer;