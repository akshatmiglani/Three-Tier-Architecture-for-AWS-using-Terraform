import { Link, Outlet, useNavigate } from 'react-router-dom'
import { ClerkProvider, SignedIn, SignedOut, UserButton } from '@clerk/clerk-react'

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) {
    throw new Error("Missing Publishable Key")
}

export default function RootLayout() {
    const navigate = useNavigate();

    return (
        <ClerkProvider
            routerPush={(to) => navigate(to)}
            routerReplace={(to) => navigate(to, { replace: true })}
            publishableKey={PUBLISHABLE_KEY}
        >
            <header className="bg-white">
                <div className="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
                    <div className="flex flex-col items-start gap-4 md:flex-row md:items-center md:justify-between">
                        <div>
                            <Link to="/">
                            <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl flex items-center">
                                Level-Up Now
                                <svg className="h-4 w-4 text-gray-500 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                </svg>
                            </h1>
                            </Link>

                            <p className="mt-1.5 text-sm text-gray-500">
                                Instant 3-Tier Architecture Deployment on AWS
                            </p>
                        </div>


                        <div className="flex items-center gap-4">
                            <div className="sm:flex sm:gap-4">
                                <SignedIn>
                                    <UserButton />
                                    <a className="block rounded-md bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-black"><Link to="/dashboard">Dashboard</Link></a>
                                </SignedIn>

                                <SignedOut>
                                    <Link to="/sign-in"> <a className="hidden border-2 rounded-md bg-white-100 px-5 py-2.5 text-sm font-medium text-red-600 transition hover:text-black-600/75 sm:block" href="#"> Sign In / Register </a></Link>
                                </SignedOut>
                            </div>
                            <button className="block rounded bg-gray-100 p-2.5 text-gray-600 transition hover:text-gray-600/75 md:hidden">
                                <span className="sr-only">Toggle menu</span>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </header>
            <main className='flex items-center justify-center h-500 m-10'>
                <Outlet />
            </main>
            <footer className="bg-gray-100">
                <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">

                    <p className="mx-auto mt-6 max-w-md text-center leading-relaxed text-gray-500">
                        Made by Akshat Miglani | 2024
                    </p>
                    <ul className="mt-12 flex justify-center gap-6 md:gap-8">
                        <li>
                            <a href="https://www.linkedin.com/in/akshatmiglani" className="inline-flex items-center">
                                <span className="sr-only">LinkedIn</span>
                                <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="25" height="25" viewBox="0 0 30 30">
                                    <path d="M24,4H6C4.895,4,4,4.895,4,6v18c0,1.105,0.895,2,2,2h18c1.105,0,2-0.895,2-2V6C26,4.895,25.105,4,24,4z M10.954,22h-2.95 v-9.492h2.95V22z M9.449,11.151c-0.951,0-1.72-0.771-1.72-1.72c0-0.949,0.77-1.719,1.72-1.719c0.948,0,1.719,0.771,1.719,1.719 C11.168,10.38,10.397,11.151,9.449,11.151z M22.004,22h-2.948v-4.616c0-1.101-0.02-2.517-1.533-2.517 c-1.535,0-1.771,1.199-1.771,2.437V22h-2.948v-9.492h2.83v1.297h0.04c0.394-0.746,1.356-1.533,2.791-1.533 c2.987,0,3.539,1.966,3.539,4.522V22z"></path>
                                </svg>
                            </a>
                        </li>
                        <li>
                            <a href="https://github.com/akshatmiglani/Three-Tier-Architecture-for-AWS-using-Terraform" className="inline-flex items-center ml-2">
                                <span className="sr-only">GitHub</span>
                                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                    <path
                                        fillRule="evenodd"
                                        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            </a>
                        </li>
                    </ul>

                </div>
            </footer>
        </ClerkProvider>
    )
}

