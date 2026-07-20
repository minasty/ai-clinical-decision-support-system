import "./Footer.css";

function Footer() {

    const currentYear = new Date().getFullYear();

    return (

        <footer className="footer">

            <p>

                © {currentYear} AI Clinical Decision Support System.
                All Rights Reserved.

            </p>

            <p>

                Developed by <strong>Anastase Minani</strong>

            </p>

        </footer>

    );

}

export default Footer;
