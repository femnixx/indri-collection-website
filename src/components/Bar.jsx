function Bar() { 
    return (
        <>
        {/* Tambahin absolute top-0 z-50 biar navbarnya melayang di atas banner */}
        <div className="absolute top-0 z-50 font-semibold w-full flex flex-row justify-between p-7 text-white">
            <p className="text-lg">Indri Collection</p>
            <div className="gap-x-10 flex flex-row justify-around">
                <a href="#" className="cursor-pointer hover:text-amber-400 transition-colors">Home</a>
                <a href="#about" className="cursor-pointer hover:text-amber-400 transition-colors">Know More</a>
                <a href="#product" className="cursor-pointer hover:text-amber-400 transition-colors">Product</a>
                <a href="#testimonial" className="cursor-pointer hover:text-amber-400 transition-colors">Testimonial</a>
                <a href="#contact" className="cursor-pointer hover:text-amber-400 transition-colors">Contact</a>
            </div>
        </div>      
        </>
    )
}

export default Bar;