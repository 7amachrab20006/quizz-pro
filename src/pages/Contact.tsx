import React from 'react';
import { motion } from 'motion/react';
import { Instagram, Phone, Mail, MessageSquare, Send, ArrowUpRight } from 'lucide-react';

export function Contact() {
  const contactDetails = [
    {
      id: 'instagram',
      label: 'Instagram',
      value: '@7m1_person_numbah_92',
      link: 'https://instagram.com/7m1_person_numbah_92',
      icon: Instagram,
      color: 'hover:text-pink-500'
    },
    {
      id: 'phone',
      label: 'Direct Line',
      value: '46 986 361',
      link: 'tel:46986361',
      icon: Phone,
      color: 'hover:text-blue-500'
    }
  ];

  return (
    <div className="max-w-4xl mx-auto py-24 space-y-16">
      <header className="space-y-6">
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="inline-block px-3 py-1 rounded-full border border-primary/20 bg-primary/5 text-[10px] font-black uppercase tracking-[3px] text-primary"
        >
          Communication Hub
        </motion.div>
        <motion.h1 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-6xl md:text-7xl font-black tracking-tighter"
        >
          Contact <span className="italic font-serif text-primary underline decoration-primary/20 underline-offset-12">Us.</span>
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-text-dim max-w-xl text-lg leading-relaxed font-light"
        >
          For scholarly inquiries, technical support, or partnership proposals, 
          reach out through our official channels.
        </motion.p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {contactDetails.map((contact, index) => {
          const Icon = contact.icon;
          return (
            <motion.a
              key={contact.id}
              href={contact.link}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              className="clean-card group flex flex-col gap-8 p-10 relative overflow-hidden"
            >
              <div className={`w-12 h-12 bg-bg-dark border border-border-dim rounded-xl flex items-center justify-center text-primary group-hover:scale-110 group-hover:border-primary/40 transition-all duration-300 ${contact.color}`}>
                <Icon size={24} />
              </div>

              <div className="space-y-1">
                <span className="text-[10px] uppercase tracking-[3px] text-text-dim font-black">{contact.label}</span>
                <div className="text-2xl font-bold tracking-tight flex items-center gap-2">
                  {contact.value}
                  <ArrowUpRight size={16} className="opacity-0 group-hover:opacity-100 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
                </div>
              </div>

              {/* Decorative background accent */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-[100px] -mr-16 -mt-16 group-hover:bg-primary/10 transition-colors"></div>
            </motion.a>
          );
        })}
      </div>

      <motion.section 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="pt-12 border-t border-border-dim"
      >
        <div className="flex flex-col md:flex-row justify-between items-center gap-8 opacity-40 grayscale group hover:grayscale-0 transition-all duration-700">
           <div className="text-[10px] font-black uppercase tracking-[5px]">Response Time: &lt; 24h</div>
           <div className="flex gap-12 font-serif italic text-sm">
              <span>Authentic</span>
              <span>Scholarly</span>
              <span>Reliable</span>
           </div>
        </div>
      </motion.section>
    </div>
  );
}
