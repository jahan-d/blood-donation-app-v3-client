import { toast } from "react-hot-toast";

const Contact = () => {
    const handleSubmit = (e) => {
        e.preventDefault();
        toast.success("Message sent! We will get back to you soon.");
        e.target.reset();
    };

    return (
        <div className="container mx-auto py-10 px-5">
            <h1 className="text-3xl font-bold text-center mb-8">Contact Us</h1>

            <div className="grid md:grid-cols-2 gap-10 items-center">
                {/* Info Section */}
                <div className="space-y-4">
                    <h2 className="text-2xl font-semibold">Get in Touch</h2>
                    <p className="text-gray-600">
                        Have questions about blood donation? Want to volunteer? Reach out to
                        us and we will be happy to assist you.
                    </p>
                    <div className="space-y-2">
                        <p>
                            <strong>Email:</strong> support@blooddonation.com
                        </p>
                        <p>
                            <strong>Phone:</strong> +880 123 456 7890
                        </p>
                        <p>
                            <strong>Address:</strong> 123 Health Street, Dhaka, Bangladesh
                        </p>
                    </div>
                </div>

                {/* Form Section */}
                <div className="card bg-base-100 shadow-xl border">
                    <div className="card-body">
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">Name</span>
                                </label>
                                <input
                                    type="text"
                                    placeholder="Your Name"
                                    className="input input-bordered"
                                    required
                                />
                            </div>

                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">Email</span>
                                </label>
                                <input
                                    type="email"
                                    placeholder="Your Email"
                                    className="input input-bordered"
                                    required
                                />
                            </div>

                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">Message</span>
                                </label>
                                <textarea
                                    className="textarea textarea-bordered h-24"
                                    placeholder="Your Message"
                                    required
                                ></textarea>
                            </div>

                            <div className="form-control mt-4">
                                <button className="btn btn-primary">Send Message</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contact;
