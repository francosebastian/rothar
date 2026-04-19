// src/app/servicios/page.tsx

import React from 'react';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const BookingAndPricingPage: React.FC = () => {
    return (
        <main className="flex min-h-screen flex-col">
            <Navbar/>

            <section className="pt-32 pb-20 bg-[#063d3d]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-5xl md:text-7xl font-display text-[#E6DAB9] tracking-wider mb-4 animate-fade-in-up">
                        SERVICIOS
                    </h1>
                    <div className="w-24 h-1 bg-[#E6DAB9] mx-auto mb-8 animate-fade-in-up delay-100"></div>
                    <p className="text-[#E6DAB9]/70 text-lg max-w-2xl mx-auto animate-fade-in-up delay-200">
                        Agenda tu servicio a través de nuestro socio: <a href="https://clicmecanica.com/" target="_blank" rel="noopener noreferrer" className="text-[#E6DAB9] underline hover:text-[#ffffff]">clicmecanica.com</a>.
                    </p>
                </div>
            </section>

            <section className="py-12 px-12 bg-[#E6DAB9]">
                <div className="max-w-24xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        {/* Sección del Formulario de Agendamiento */}
                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <iframe
                                src="https://clicmecanica.com/public/booking/6mbzcuwify"
                                className="w-full h-[1300px] border-none rounded-md"
                                title="Formulario de Agendamiento de Servicios"
                            ></iframe>
                        </div>
                </div>
            </section>
            <Footer/>
        </main>
    );
};

export default BookingAndPricingPage;
