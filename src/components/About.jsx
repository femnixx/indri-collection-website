import React from 'react';

function About() {
  return (
    <section id="about" className="py-24 bg-white px-6 scroll-reveal">
      <div className="max-w-4xl mx-auto text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-400 text-blue-950 text-[10px] font-black uppercase tracking-widest rounded">
          Filosofi Kami ✦
        </div>
        <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight text-blue-900">
          Presisi dalam <br className="md:hidden" /> Setiap Jahitan
        </h2>
        <p className="text-neutral-600 leading-relaxed text-sm md:text-base">
          Menghadirkan keunikan dan kualitas untuk setiap pelanggan. Perbedaan spesialisasi bukan penghalang, melainkan kekuatan untuk melahirkan solusi yang segar dan belum pernah ada sebelumnya. Dari ide kecil, kami merajut karya yang bersinar.
        </p>
      </div>
    </section>
  );
}

export default About;