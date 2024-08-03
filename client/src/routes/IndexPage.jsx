import { Link } from "react-router-dom";

export default function IndexPage() {
    return (
        <>
            <section>
                <div className="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
                    <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-16">
                        <div className="relative h-64 overflow-hidden rounded-lg sm:h-80 lg:order-last lg:h-full">
                            <img
                                alt=""
                                src="/src/assets/Image-1.png"
                                className="absolute inset-0 h-full w-full object-cover"
                            />
                        </div>

                        <div className="lg:py-24">
                            <h2 className="text-3xl font-bold sm:text-4xl">Achieve scalability and security for your application</h2>

                            <p className="mt-4 text-gray-600">
                                Ensure your application is both scalable and secure with our innovative solution. Our one-click setup for a three-tier architecture on AWS simplifies the process of building robust and efficient systems. Ready to elevate your application? Achieve scalability and security effortlessly with our three-tier architecture setup.
                            </p>

                            <a
                                href="#"
                                className="mt-8 inline-block rounded bg-blue-600 px-12 py-3 text-sm font-medium text-white transition hover:bg-black focus:outline-none focus:ring focus:ring-yellow-400"
                            >
                                <Link to="/sign-up">
                                    Start Now
                                </Link>
                            </a>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}