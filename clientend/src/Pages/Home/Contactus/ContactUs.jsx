import ContactUsForm from "../../../Components/ContactUsForm/ContactUsForm";
import SecTitle from "../../../Components/SectionTitle/SecTitle";

const ContactUs = () => {
    return (
        <div className="container mx-auto my-10">
            <SecTitle title={"Contact Us"} subHeading={"Empowering Communication: Contact Us Now"} />
            <div className="md:flex justify-around  place-items-center gap-10">
                <div className="text-center">
                    <img src="https://ashokascales.com/wp-content/uploads/2023/02/contact_us.gif" alt="" />
                    <p className="mt-4 text-lg text-gray-700">
                        যোগাযোগ করুন: <a href="mailto:imranhossain000000001@gmail.com" className="text-wine font-semibold hover:underline">imranhossain000000001@gmail.com</a>
                    </p>
                </div>
                <div>
                    <ContactUsForm />
                </div>
            </div>
        </div>
    );
};

export default ContactUs;