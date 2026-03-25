import { useRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Phone, Mail, MapPin, AlertCircle, Loader2 } from 'lucide-react';
import { useGSAP } from '@/hooks/useGSAP';
import { gsap } from '@/lib/gsap-config';
import { useOrderSubmit } from '@/hooks/useOrderSubmit';
import { useAppStore } from '@/stores/useAppStore';
import { orderSchema, type OrderFormValues } from '@/types';
import { formatPrice } from '@/lib/utils';
import { WHATSAPP_NUMBER, DELIVERY_ZONES } from '@/constants/business';
import {
  FORM_FIELD_STAGGER,
  FORM_FIELD_REVEAL_Y,
  CONFIRMATION_CHECK_DURATION,
  CONFIRMATION_PATH_DURATION,
} from '@/constants/animation';

export function ContactSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const formContainerRef = useRef<HTMLDivElement>(null);
  const confirmationRef = useRef<HTMLDivElement>(null);
  const checkCircleRef = useRef<SVGSVGElement>(null);
  const checkPathRef = useRef<SVGPathElement>(null);

  const orderItems = useAppStore((state) => state.orderItems);
  const clearOrder = useAppStore((state) => state.clearOrder);
  const getOrderTotal = useAppStore((state) => state.getOrderTotal);

  const { status, submit, reset: resetSubmit } = useOrderSubmit();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset: resetForm,
    setValue,
    watch,
  } = useForm<OrderFormValues>({
    resolver: zodResolver(orderSchema),
    mode: 'onChange',
    defaultValues: {
      customer_name: '',
      customer_phone: '',
      customer_email: '',
      items: [],
      notes: '',
      delivery_zone: '',
      total_estimate: 0,
    },
  });

  // Sync Zustand order items into form
  useEffect(() => {
    setValue('items', orderItems, { shouldValidate: true });
    setValue('total_estimate', getOrderTotal());
  }, [orderItems, setValue, getOrderTotal]);

  // Scroll reveal for form fields
  useGSAP(
    () => {
      const container = formContainerRef.current;
      if (!container) return;

      const fields = container.querySelectorAll('.form-field');
      if (!fields.length) return;

      gsap.from(fields, {
        scrollTrigger: {
          trigger: container,
          start: 'top 90%',
          once: true,
        },
        y: FORM_FIELD_REVEAL_Y,
        opacity: 0,
        stagger: FORM_FIELD_STAGGER,
        duration: 0.6,
        ease: 'power2.out',
      });
    },
    [],
    sectionRef
  );

  // Confirmation animation on success
  useEffect(() => {
    if (status !== 'success') return;

    const tl = gsap.timeline();

    if (checkCircleRef.current) {
      tl.fromTo(
        checkCircleRef.current,
        { scale: 0, opacity: 0 },
        { scale: 1, opacity: 1, duration: CONFIRMATION_CHECK_DURATION, ease: 'back.out(1.7)' }
      );
    }

    if (checkPathRef.current) {
      const pathLength = checkPathRef.current.getTotalLength();
      tl.fromTo(
        checkPathRef.current,
        { strokeDasharray: pathLength, strokeDashoffset: pathLength },
        { strokeDashoffset: 0, duration: CONFIRMATION_PATH_DURATION, ease: 'power2.inOut' }
      );
    }

    if (confirmationRef.current) {
      const text = confirmationRef.current.querySelector('.confirmation-text');
      if (text) {
        tl.fromTo(
          text,
          { opacity: 0, y: 10 },
          { opacity: 1, y: 0, duration: 0.4 },
          '-=0.2'
        );
      }
    }

    return () => {
      tl.kill();
    };
  }, [status]);

  const onSubmit = async (data: OrderFormValues) => {
    await submit({
      customer_name: data.customer_name,
      customer_phone: data.customer_phone,
      customer_email: data.customer_email || undefined,
      items: data.items,
      notes: data.notes || undefined,
      delivery_zone: data.delivery_zone || undefined,
      total_estimate: data.total_estimate,
    });
  };

  const handleReset = () => {
    resetForm();
    resetSubmit();
    clearOrder();
  };

  const notesValue = watch('notes');
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('Hola! Quiero hacer un pedido')}`;

  const inputClasses =
    'w-full rounded-lg border border-[rgba(12,10,9,0.12)] bg-white px-4 py-3 font-body text-sm text-bg-primary placeholder:text-[rgba(12,10,9,0.4)] focus:border-yolk focus:outline-none focus:ring-1 focus:ring-yolk';
  const errorClasses = 'mt-1 flex items-center gap-1 font-body text-xs text-error';

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="contact-section bg-cream py-section"
      aria-label="Contacto y pedidos"
    >
      <div className="mx-auto max-w-5xl px-6">
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-2">
          {/* Left column: info */}
          <div>
            <p className="font-mono text-xs uppercase tracking-widest text-yolk-deep">
              Contacto
            </p>
            <h2 className="mt-3 font-heading text-section text-bg-primary">
              Hacé tu pedido
            </h2>
            <p className="mt-4 max-w-md font-body text-body text-[rgba(12,10,9,0.7)]">
              Completá el formulario y te contactamos para confirmar.
              También podés escribirnos directo por WhatsApp.
            </p>

            <div className="mt-10 flex flex-col gap-4">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-[44px] items-center gap-3 rounded-xl border border-[rgba(12,10,9,0.12)] px-5 py-3 font-body text-sm text-bg-primary transition-colors hover:border-yolk-deep hover:text-yolk-deep"
              >
                <Phone className="h-4 w-4" />
                WhatsApp directo
              </a>
              <div className="inline-flex items-center gap-3 px-5 py-3 font-body text-sm text-[rgba(12,10,9,0.6)]">
                <Mail className="h-4 w-4" />
                info@huevospoint.com.ar
              </div>
              <div className="inline-flex items-center gap-3 px-5 py-3 font-body text-sm text-[rgba(12,10,9,0.6)]">
                <MapPin className="h-4 w-4" />
                Buenos Aires, Argentina
              </div>
            </div>

            {/* Order summary */}
            {orderItems.length > 0 && (
              <div className="mt-10 rounded-xl border border-[rgba(12,10,9,0.12)] bg-white/60 p-5">
                <h3 className="font-body text-sm font-bold text-bg-primary">
                  Tu pedido ({orderItems.length} {orderItems.length === 1 ? 'producto' : 'productos'})
                </h3>
                <ul className="mt-3 flex flex-col gap-2">
                  {orderItems.map((item) => (
                    <li
                      key={item.product_id}
                      className="flex items-center justify-between font-body text-sm text-[rgba(12,10,9,0.7)]"
                    >
                      <span>
                        {item.product_name} x{item.quantity}
                      </span>
                      <span className="font-mono text-xs">
                        {formatPrice(item.unit_price * item.quantity)}
                      </span>
                    </li>
                  ))}
                </ul>
                <div className="mt-3 border-t border-[rgba(12,10,9,0.12)] pt-3 flex items-center justify-between">
                  <span className="font-body text-sm font-bold text-bg-primary">Total estimado</span>
                  <span className="font-mono text-sm font-bold text-yolk-deep">
                    {formatPrice(getOrderTotal())}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Right column: form or confirmation */}
          <div ref={formContainerRef} className="contact-form">
            {status === 'success' ? (
              /* ─── Confirmation state ─── */
              <div
                ref={confirmationRef}
                className="flex flex-col items-center justify-center rounded-2xl bg-white/80 p-12 text-center shadow-sm backdrop-blur-sm"
              >
                <svg
                  ref={checkCircleRef}
                  className="h-20 w-20"
                  viewBox="0 0 80 80"
                  fill="none"
                  style={{ opacity: 0, transform: 'scale(0)' }}
                >
                  <circle cx="40" cy="40" r="38" stroke="var(--color-success)" strokeWidth="3" fill="none" />
                  <path
                    ref={checkPathRef}
                    d="M24 42 L34 52 L56 30"
                    stroke="var(--color-success)"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                  />
                </svg>
                <div className="confirmation-text mt-6" style={{ opacity: 0 }}>
                  <h3 className="font-heading text-2xl text-bg-primary">
                    ¡Pedido enviado!
                  </h3>
                  <p className="mt-2 font-body text-sm text-[rgba(12,10,9,0.7)]">
                    Te contactaremos por WhatsApp para confirmar los detalles.
                  </p>
                  <button
                    onClick={handleReset}
                    type="button"
                    className="mt-6 min-h-[44px] rounded-lg border border-[rgba(12,10,9,0.2)] px-6 py-2 font-body text-sm text-bg-primary transition-colors hover:border-bg-primary"
                  >
                    Hacer otro pedido
                  </button>
                </div>
              </div>
            ) : (
              /* ─── Form ─── */
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="rounded-2xl bg-white/80 p-8 shadow-sm backdrop-blur-sm"
                noValidate
              >
                {/* Honeypot — invisible to users, catches bots */}
                <div className="absolute -left-[9999px]" aria-hidden="true">
                  <label htmlFor="website">Website</label>
                  <input
                    id="website"
                    type="text"
                    tabIndex={-1}
                    autoComplete="off"
                    {...register('customer_email' as never, {
                      // This is a decoy — real email is below
                    })}
                    name="website"
                  />
                </div>

                <div className="flex flex-col gap-5">
                  {/* Name */}
                  <div className="form-field">
                    <label
                      htmlFor="customer_name"
                      className="mb-1.5 block font-body text-sm font-medium text-bg-primary"
                    >
                      Nombre completo *
                    </label>
                    <input
                      id="customer_name"
                      type="text"
                      placeholder="Tu nombre"
                      className={inputClasses}
                      aria-invalid={!!errors.customer_name}
                      aria-describedby={errors.customer_name ? 'name-error' : undefined}
                      {...register('customer_name')}
                    />
                    {errors.customer_name && (
                      <p id="name-error" className={errorClasses} role="alert">
                        <AlertCircle className="h-3 w-3" />
                        {errors.customer_name.message}
                      </p>
                    )}
                  </div>

                  {/* Phone */}
                  <div className="form-field">
                    <label
                      htmlFor="customer_phone"
                      className="mb-1.5 block font-body text-sm font-medium text-bg-primary"
                    >
                      Teléfono (WhatsApp) *
                    </label>
                    <input
                      id="customer_phone"
                      type="tel"
                      placeholder="+54 9 11 XXXX-XXXX"
                      className={inputClasses}
                      aria-invalid={!!errors.customer_phone}
                      aria-describedby={errors.customer_phone ? 'phone-error' : undefined}
                      {...register('customer_phone')}
                    />
                    {errors.customer_phone && (
                      <p id="phone-error" className={errorClasses} role="alert">
                        <AlertCircle className="h-3 w-3" />
                        {errors.customer_phone.message}
                      </p>
                    )}
                  </div>

                  {/* Email */}
                  <div className="form-field">
                    <label
                      htmlFor="customer_email"
                      className="mb-1.5 block font-body text-sm font-medium text-bg-primary"
                    >
                      Email
                    </label>
                    <input
                      id="customer_email"
                      type="email"
                      placeholder="tu@email.com"
                      className={inputClasses}
                      aria-invalid={!!errors.customer_email}
                      aria-describedby={errors.customer_email ? 'email-error' : undefined}
                      {...register('customer_email')}
                    />
                    {errors.customer_email && (
                      <p id="email-error" className={errorClasses} role="alert">
                        <AlertCircle className="h-3 w-3" />
                        {errors.customer_email.message}
                      </p>
                    )}
                  </div>

                  {/* Delivery zone */}
                  <div className="form-field">
                    <label
                      htmlFor="delivery_zone"
                      className="mb-1.5 block font-body text-sm font-medium text-bg-primary"
                    >
                      Zona de entrega
                    </label>
                    <select
                      id="delivery_zone"
                      className={inputClasses}
                      {...register('delivery_zone')}
                    >
                      <option value="">Seleccioná tu zona</option>
                      {DELIVERY_ZONES.map((zone) => (
                        <option key={zone} value={zone}>
                          {zone}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Notes */}
                  <div className="form-field">
                    <label
                      htmlFor="notes"
                      className="mb-1.5 block font-body text-sm font-medium text-bg-primary"
                    >
                      Notas adicionales
                    </label>
                    <textarea
                      id="notes"
                      rows={3}
                      placeholder="Instrucciones especiales..."
                      className={`${inputClasses} resize-none`}
                      maxLength={500}
                      aria-invalid={!!errors.notes}
                      aria-describedby={errors.notes ? 'notes-error' : 'notes-counter'}
                      {...register('notes')}
                    />
                    <div className="mt-1 flex items-center justify-between">
                      {errors.notes ? (
                        <p id="notes-error" className={errorClasses} role="alert">
                          <AlertCircle className="h-3 w-3" />
                          {errors.notes.message}
                        </p>
                      ) : (
                        <span />
                      )}
                      <span id="notes-counter" className="font-mono text-[10px] text-[rgba(12,10,9,0.4)]">
                        {notesValue?.length ?? 0}/500
                      </span>
                    </div>
                  </div>

                  {/* Products reminder */}
                  {orderItems.length === 0 && (
                    <div className="form-field rounded-lg border border-yolk-deep/20 bg-yolk/5 p-4">
                      <p className="font-body text-sm text-yolk-deep">
                        Agregá productos desde el catálogo antes de enviar tu pedido.
                      </p>
                    </div>
                  )}

                  {/* Error toast */}
                  {status === 'error' && (
                    <div className="form-field rounded-lg border border-error/20 bg-error/5 p-4" role="alert">
                      <p className="font-body text-sm text-error">
                        Error al enviar el pedido. Por favor intentá de nuevo.
                      </p>
                    </div>
                  )}

                  {/* Submit */}
                  <div className="form-field pt-2">
                    <button
                      type="submit"
                      disabled={status === 'submitting' || !isValid || orderItems.length === 0}
                      className="w-full min-h-[44px] rounded-lg bg-bg-primary px-6 py-3 font-body font-bold text-text-primary transition-colors hover:bg-bg-secondary disabled:cursor-not-allowed disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {status === 'submitting' ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Enviando...
                        </>
                      ) : (
                        'Enviar pedido'
                      )}
                    </button>
                  </div>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
