import React from 'react';

function Footer() {
    return (
        <footer className="rounded-t-lg bg-purple-200 px-4 py-2 pb-4 mt-6 ">
            <div className="container mx-auto text-left text-slate-600 text-sm">
                <p>&copy; {new Date().getFullYear()} ECTTS 2.0 . All rights reserved.</p>
                <nav>
                    <ul className="flex justify-center space-x-6 mt-2 text-base text-slate-900">
                        <li><a href="/privacy" className="hover:underline">Privacy Policy</a></li>
                        <span>|</span>
                        <li><a href="/" className="hover:underline">Home</a></li>
                        <span>|</span>
                        <li><a href="/contact" className="hover:underline">Contact Us</a></li>
                    </ul>
                </nav>
            </div>
        </footer>
    );
}

export default Footer;