'use client';

import {useState, useEffect, useRef} from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {usePathname} from 'next/navigation';
import {useSession, signOut} from 'next-auth/react';
import {useCartStore} from '@/lib/store';

interface NavItem {
    label: string;
    href: string;
}

const navItems: NavItem[] = [
    {label: 'INICIO', href: '/'},
    {label: 'SERVICIOS', href: '/servicios'},
    {label: 'TIENDA', href: '/tienda'},
    {label: 'BLOG', href: '/blog'},
    {label: 'VIDEOS', href: '/videos'},
    {label: 'CONTACTO', href: '/#contacto'},
];

export default function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [showResults, setShowResults] = useState(false);
    const searchRef = useRef<HTMLDivElement>(null);
    const mobileSearchRef = useRef<HTMLDivElement>(null);
    const pathname = usePathname();
    const itemCount = useCartStore((state) => state.items.reduce((acc, item) => acc + item.cantidad, 0));
    const itemsLength = useCartStore((state) => state.items.length);

    useEffect(() => {
        const fetchResults = async () => {
            if (searchQuery.length > 0) {
                try {
                    const res = await fetch(`/api/products?search=${encodeURIComponent(searchQuery)}`);
                    if (res.ok) {
                        const data = await res.json();
                        setSearchResults(data.slice(0, 5));
                    }
                } catch (error) {
                    console.error('Error searching products:', error);
                }
            } else {
                setSearchResults([]);
            }
        };

        const debounce = setTimeout(fetchResults, 300);
        return () => clearTimeout(debounce);
    }, [searchQuery]);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as Node;
            const isOutsideDesktop = searchRef.current && !searchRef.current.contains(target);
            const isOutsideMobile = mobileSearchRef.current && !mobileSearchRef.current.contains(target);
            if (isOutsideDesktop && isOutsideMobile) {
                setShowResults(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const { data: session, status } = useSession();
    const isAuthenticated = status === 'authenticated';
    const isHome = pathname === '/';

    if (!mounted) return null;

    return (
        <nav
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
                isScrolled || !isHome
                    ? 'bg-[#063d3d] shadow-lg'
                    : 'bg-transparent'
            }`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16 lg:h-20">
                    <Link href="/" className="flex items-center gap-2 shrink-0">
                        <Image
                            src="/logo.png"
                            alt="Logo Rothar Workshop"
                            width={110}
                            height={35}
                            className="object-contain lg:w-auto w-[110px]"
                            style={{width: 'auto', height: 'auto'}}
                        />
                    </Link>

                    <div className="hidden lg:flex items-center gap-6">
                        {navItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className="text-[#E6DAB9] font-medium hover:text-[#E6DAB9]/70 transition-colors uppercase tracking-wide text-sm"
                            >
                                {item.label}
                            </Link>
                        ))}

                        <div ref={searchRef} className="relative">
                            <div className="flex items-center bg-[#E6DAB9]/10 rounded-lg px-3 py-2">
                                <svg className="w-4 h-4 text-[#E6DAB9]/70 mr-2" fill="none" stroke="currentColor"
                                     viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                                </svg>
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => {
                                        setSearchQuery(e.target.value);
                                        setShowResults(true);
                                    }}
                                    onFocus={() => setShowResults(true)}
                                    placeholder="Buscar productos..."
                                    className="bg-transparent text-[#E6DAB9] placeholder-[#E6DAB9]/50 text-sm outline-none w-48"
                                />
                            </div>

                            {showResults && searchQuery.length > 0 && (
                                <div
                                    className="absolute top-full left-0 right-0 mt-2 bg-[#063d3d] border border-[#E6DAB9]/20 rounded-lg shadow-xl z-50 max-h-80 overflow-y-auto">
                                    {searchResults.length > 0 ? (
                                        <>
                                            {searchResults.map((product) => (
                                                <Link
                                                    key={product.id}
                                                    href={`/tienda?q=${product.name}`}
                                                    onClick={() => {
                                                        setShowResults(false);
                                                        setSearchQuery('');
                                                    }}
                                                    className="block px-4 py-3 hover:bg-[#E6DAB9]/10 transition-colors border-b border-[#E6DAB9]/10 last:border-0"
                                                >
                                                    <div
                                                        className="text-[#E6DAB9] text-sm font-medium">{product.name}</div>
                                                    <div className="text-[#E6DAB9]/60 text-xs mt-1">
                                                        {product.category} - ${product.price.toLocaleString('es-CL')}
                                                    </div>
                                                </Link>
                                            ))}
                                            <Link
                                                href={`/tienda?q=${searchQuery}`}
                                                onClick={() => {
                                                    setShowResults(false);
                                                    setSearchQuery('');
                                                }}
                                                className="block px-4 py-3 text-center text-[#E6DAB9] hover:bg-[#E6DAB9]/10 transition-colors text-sm font-medium"
                                            >
                                                Ver todos los resultados
                                            </Link>
                                        </>
                                    ) : (
                                        <div className="px-4 py-3 text-[#E6DAB9]/60 text-sm">
                                            No se encontraron productos
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        <Link href="/carrito" className="relative text-[#E6DAB9] hover:text-[#E6DAB9]/70 transition-colors">
                            <svg
                                className="w-6 h-6"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
                                />
                            </svg>
                            {itemsLength > 0 && (
                                <span className="absolute -top-2 -right-2 bg-[#E6DAB9] text-[#084C4C] text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-bold shadow-sm">
                            {itemCount}
                                </span>
                            )}
                        </Link>

                        {isAuthenticated ? (
                            <div className="flex items-center gap-4">
                                <Link
                                    href="/perfil"
                                    className="text-[#E6DAB9] text-sm hidden md:flex items-center gap-2 hover:text-[#E6DAB9]/70 transition-colors"
                                >
                                    <span className="w-8 h-8 bg-[#E6DAB9] text-[#084C4C] rounded-full flex items-center justify-center text-xs font-bold uppercase">
                                        {(session?.user?.name || session?.user?.email || 'U').split(' ')[0].charAt(0)}
                                    </span>
                                    <span className="hidden lg:block">
                                        {(session?.user?.name || session?.user?.email || 'Usuario').split(' ')[0]}
                                    </span>
                                </Link>
                                <button
                                    onClick={() => signOut({ callbackUrl: '/' })}
                                    className="text-[#E6DAB9] hover:text-[#E6DAB9]/70 transition-colors"
                                    title="Cerrar Sesión"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                    </svg>
                                </button>
                            </div>
                        ) : (
                            <Link
                                href="/login"
                                className="text-[#E6DAB9] hover:text-[#E6DAB9]/70 transition-colors text-sm uppercase tracking-wide"
                            >
                                Iniciar Sesión
                            </Link>
                        )}
                    </div>

                    <div className="lg:hidden flex-1 mx-2">
                        <div ref={mobileSearchRef} className="relative">
                            <div className="flex items-center bg-[#E6DAB9]/10 rounded-lg px-3 py-2">
                                <svg className="w-4 h-4 text-[#E6DAB9]/70 mr-2 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                                </svg>
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => {
                                        setSearchQuery(e.target.value);
                                        setShowResults(true);
                                    }}
                                    onFocus={() => setShowResults(true)}
                                    placeholder="Buscar..."
                                    className="bg-transparent text-[#E6DAB9] placeholder-[#E6DAB9]/50 text-sm outline-none w-full"
                                />
                            </div>
                            {showResults && searchQuery.length > 0 && (
                                <div className="absolute top-full left-0 right-0 mt-1 bg-[#063d3d] border border-[#E6DAB9]/20 rounded-lg shadow-xl z-50 max-h-60 overflow-y-auto">
                                    {searchResults.length > 0 ? (
                                        <>
                                            {searchResults.map((product) => (
                                                <Link
                                                    key={product.id}
                                                    href={`/tienda?q=${product.name}`}
                                                    onClick={() => {
                                                        setShowResults(false);
                                                        setSearchQuery('');
                                                    }}
                                                    className="block px-4 py-3 hover:bg-[#E6DAB9]/10 transition-colors border-b border-[#E6DAB9]/10 last:border-0"
                                                >
                                                    <div className="text-[#E6DAB9] text-sm font-medium">{product.name}</div>
                                                    <div className="text-[#E6DAB9]/60 text-xs mt-1">
                                                        {product.category} - ${product.price.toLocaleString('es-CL')}
                                                    </div>
                                                </Link>
                                            ))}
                                            <Link
                                                href={`/tienda?q=${searchQuery}`}
                                                onClick={() => {
                                                    setShowResults(false);
                                                    setSearchQuery('');
                                                }}
                                                className="block px-4 py-3 text-center text-[#E6DAB9] hover:bg-[#E6DAB9]/10 transition-colors text-sm font-medium"
                                            >
                                                Ver todos los resultados
                                            </Link>
                                        </>
                                    ) : (
                                        <div className="px-4 py-3 text-[#E6DAB9]/60 text-sm">
                                            No se encontraron productos
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="lg:hidden text-[#E6DAB9] p-2 cursor-pointer"
                        aria-label="Menu"
                    >
                        <svg
                            className="w-6 h-6 pointer-events-none"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            {isMobileMenuOpen ? (
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            ) : (
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M4 6h16M4 12h16M4 18h16"
                                />
                            )}
                        </svg>
                    </button>
                </div>

                <div
                    className={`lg:hidden bg-[#063d3d] transition-all duration-300 overflow-y-auto ${
                        isMobileMenuOpen ? 'max-h-[80vh]' : 'max-h-0'
                    }`}
                >
                    <div className="px-4 py-4 space-y-2">
                        {navItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="block text-[#E6DAB9] py-3 hover:text-[#E6DAB9]/70 transition-colors uppercase cursor-pointer"
                            >
                                {item.label}
                            </Link>
                        ))}

                        <div className="border-t border-[#E6DAB9]/10 pt-4 mt-4">
                            {isAuthenticated ? (
                                <div className="flex items-center justify-between">
                                    <Link
                                        href="/perfil"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="flex items-center gap-3 text-sm hover:text-[#E6DAB9]/70 transition-colors"
                                    >
                                    <span className="w-8 h-8 bg-[#E6DAB9] text-[#084C4C] rounded-full flex items-center justify-center text-xs font-bold uppercase shrink-0">
                                        {(session?.user?.name || session?.user?.email || 'U').split(' ')[0].charAt(0)}
                                    </span>
                                        <span className="text-[#E6DAB9]">
                                        {(session?.user?.name || session?.user?.email || 'Usuario').split(' ')[0]}
                                    </span>
                                    </Link>
                                    <button
                                        onClick={() => {
                                            setIsMobileMenuOpen(false);
                                            signOut({ callbackUrl: '/' });
                                        }}
                                        className="text-[#E6DAB9] hover:text-[#E6DAB9]/70 transition-colors p-2"
                                        title="Cerrar Sesión"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                        </svg>
                                    </button>
                                </div>
                            ) : (
                                <Link
                                    href="/login"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="block w-full text-center bg-green-600 text-white py-3 font-display tracking-wider hover:bg-green-700 transition-colors uppercase"
                                >
                                    Iniciar Sesión
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
}