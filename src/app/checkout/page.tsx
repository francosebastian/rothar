'use client';

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useCartStore } from "@/lib/store";
import { useState, useEffect } from "react";
import Link from "next/link";
import { initMercadoPago, CardPayment } from '@mercadopago/sdk-react';

export default function CheckoutPage() {
  const items = useCartStore((state) => state.items);
  const getTotal = useCartStore((state) => state.getTotal);
  const clearCart = useCartStore((state) => state.clearCart);
  
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    direccion: '',
    ciudad: 'Santiago',
    comuna: '',
    fechaEntrega: '',
    horaEntrega: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const publicKey = process.env.NEXT_PUBLIC_MERCADO_PAGO_PUBLIC_KEY;
    if (publicKey) {
      initMercadoPago(publicKey);
    }
  }, []);

  if (items.length === 0) {
    return (
      <main className="flex min-h-screen flex-col">
        <Navbar />
        <section className="flex-1 flex items-center justify-center bg-[#E6DAB9]">
          <div className="text-center">
            <h2 className="text-3xl font-display text-[#084C4C] mb-4">No hay productos en el carrito</h2>
            <Link 
              href="/tienda"
              className="bg-[#084C4C] text-[#E6DAB9] px-8 py-4 font-display text-lg tracking-wider hover:bg-[#063d3d] transition-colors inline-block"
            >
              IR A LA TIENDA
            </Link>
          </div>
        </section>
        <Footer />
      </main>
    );
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmitDelivery = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.direccion || !formData.comuna) {
      setError('Por favor completa la dirección de entrega');
      return;
    }
    setError('');
    setStep(2);
  };

  const handlePaymentSubmit = async (cardFormData: any) => {
    setLoading(true);
    setError('');
    
    try {
      const paymentData = {
        token: cardFormData.token,
        payment_method_id: cardFormData.payment_method_id,
        installments: cardFormData.installments,
        transaction_amount: getTotal(),
        payer: cardFormData.payer,
        external_reference: `PED-${Date.now()}`,
      };

      const response = await fetch('/api/mercadopago/payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(paymentData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al procesar el pago');
      }
      
      const data = await response.json();
      
      if (data.status === 'approved') {
        clearCart();
        // Redirect to success page
        window.location.href = '/pedido-exito';
      } else if (data.status === 'pending') {
        setError('Pago pendiente. Te notificaremos cuando se apruebe.');
      } else {
        setError(`Pago ${data.status}. Intenta con otro método de pago.`);
      }
    } catch (err: any) {
      setError(err.message || 'Error al procesar el pago. Intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col">
      <Navbar />
      
      <section className="flex-1 py-20 bg-[#E6DAB9]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-display text-[#084C4C] tracking-wider mb-8">
            CHECKOUT
          </h1>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 mb-6">
              {error}
            </div>
          )}

          {/* Resumen del pedido */}
          <div className="bg-[#084C4C] shadow-lg p-6 mb-8">
            <h2 className="text-2xl font-display text-[#E6DAB9] tracking-wider mb-4">Tu Pedido</h2>
            {items.map((item) => (
              <div key={item.id} className="flex justify-between py-2 border-b border-[#E6DAB9]/20 last:border-0">
                <span className="text-[#E6DAB9]">{item.nombre} x{item.cantidad}</span>
                <span className="text-[#E6DAB9]">${(item.precio * item.cantidad).toLocaleString('es-CL')}</span>
              </div>
            ))}
            <div className="flex justify-between mt-4 pt-4 border-t border-[#E6DAB9]/20">
              <span className="text-2xl font-display text-[#E6DAB9]">TOTAL</span>
              <span className="text-2xl font-display text-[#E6DAB9]">${getTotal().toLocaleString('es-CL')}</span>
            </div>
          </div>

          {step === 1 && (
            <form onSubmit={handleSubmitDelivery} className="bg-[#084C4C] shadow-lg p-6">
              <h2 className="text-2xl font-display text-[#E6DAB9] tracking-wider mb-6">Datos de Entrega</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-[#E6DAB9] mb-2">Nombre completo *</label>
                  <input
                    type="text"
                    name="nombre"
                    required
                    value={formData.nombre}
                    onChange={handleInputChange}
                    className="w-full p-3 bg-[#E6DAB9] text-[#084C4C] border-0 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[#E6DAB9] mb-2">Email *</label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full p-3 bg-[#E6DAB9] text-[#084C4C] border-0 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[#E6DAB9] mb-2">Teléfono *</label>
                  <input
                    type="tel"
                    name="telefono"
                    required
                    value={formData.telefono}
                    onChange={handleInputChange}
                    className="w-full p-3 bg-[#E6DAB9] text-[#084C4C] border-0 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[#E6DAB9] mb-2">Ciudad *</label>
                  <input
                    type="text"
                    name="ciudad"
                    required
                    value={formData.ciudad}
                    onChange={handleInputChange}
                    className="w-full p-3 bg-[#E6DAB9] text-[#084C4C] border-0 focus:outline-none"
                  />
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-[#E6DAB9] mb-2">Dirección de entrega *</label>
                <input
                  type="text"
                  name="direccion"
                  required
                  placeholder="Calle, número, departamento"
                  value={formData.direccion}
                  onChange={handleInputChange}
                  className="w-full p-3 bg-[#E6DAB9] text-[#084C4C] border-0 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-[#E6DAB9] mb-2">Comuna *</label>
                  <input
                    type="text"
                    name="comuna"
                    required
                    value={formData.comuna}
                    onChange={handleInputChange}
                    className="w-full p-3 bg-[#E6DAB9] text-[#084C4C] border-0 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[#E6DAB9] mb-2">Fecha de entrega preferida</label>
                  <input
                    type="date"
                    name="fechaEntrega"
                    value={formData.fechaEntrega}
                    onChange={handleInputChange}
                    className="w-full p-3 bg-[#E6DAB9] text-[#084C4C] border-0 focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-[#E6DAB9] text-[#084C4C] py-4 font-display text-lg tracking-wider hover:bg-[#d4c9a5] transition-colors"
              >
                CONTINUAR AL PAGO
              </button>
            </form>
          )}

              {step === 2 && (
                <div className="bg-[#084C4C] shadow-lg p-6">
                  <h2 className="text-2xl font-display text-[#E6DAB9] tracking-wider mb-6">Método de Pago</h2>
                  
                  <div className="mb-6 p-4 bg-[#E6DAB9]/10 border border-[#E6DAB9]/20">
                    <p className="text-[#E6DAB9] mb-2">Dirección de entrega:</p>
                    <p className="text-[#E6DAB9]/70">{formData.direccion}, {formData.comuna}, {formData.ciudad}</p>
                  </div>

                  {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 mb-6">
                      {error}
                    </div>
                  )}

                  <div className="mb-6">
                    <CardPayment
                      initialization={{ amount: getTotal() }}
                      onSubmit={handlePaymentSubmit}
                      onReady={() => setLoading(true)}
                      onError={(error) => {
                        console.error(error);
                        setError('Error al cargar el formulario de pago');
                      }}
                    />
                  </div>

                  <button
                    onClick={() => setStep(1)}
                    className="w-full bg-transparent border-2 border-[#E6DAB9] text-[#E6DAB9] py-4 font-display tracking-wider hover:bg-[#E6DAB9] hover:text-[#084C4C] transition-colors"
                  >
                    VOLVER A DATOS DE ENTREGA
                  </button>
                </div>
              )}
        </div>
      </section>

      <Footer />
    </main>
  );
}
