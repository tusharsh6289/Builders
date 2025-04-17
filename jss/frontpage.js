


document.addEventListener('DOMContentLoaded', () => {
    console.log('Mummy Meals Website Loaded - Relevant index.html scripts running');

    
    const imageCards = document.querySelectorAll('.image-card'); 
    
    if (imageCards.length > 0) {
        console.log(`Found ${imageCards.length} image cards for animation.`);
        const checkSlideAnimation = () => {
            const triggerBottom = window.innerHeight * 0.85; 
            
            imageCards.forEach((card, index) => {
                const cardTop = card.getBoundingClientRect().top;
                
                if (cardTop < triggerBottom && !card.classList.contains('show')) {
                    card.classList.add('show'); 
                    
                    card.style.transitionDelay = `${index * 0.15}s`; 
                    
                }
            });
        };
        checkSlideAnimation();
        
        window.addEventListener('scroll', checkSlideAnimation); 
        
    } else {
        console.log('No image cards (.image-card) found for animation.');
    }

    
    const modal = document.getElementById('cardModal'); 
    
    const imageCardsForModal = document.querySelectorAll('.image-card'); 
    

    if (modal && imageCardsForModal.length > 0) {
        console.log('Found modal (#cardModal) and cards. Setting up modal listeners.');
        const modalTitle = document.getElementById('modalTitle'); 
        
        const modalText = document.getElementById('modalText');  
        
        const closeBtn = modal.querySelector('.close');          
        

        
        const cardDetails = {
            'Daily Fresh Meals': `At Mummy Meals, every dish is prepared fresh daily with love and care by experienced home cooks—our mummys. We use locally sourced, high-quality ingredients to ensure every tiffin is packed with nutrition and authentic flavour. Our rotating menu offers variety, bringing you different tastes of home cooking every day, delivered right on time.`,
            'Hygienic Packaging': 'Our commitment to hygiene is evident in every aspect of Mummy Meals. Meals are prepared in meticulously clean home kitchens following strict hygiene protocols. We use food-grade, tamper-proof, and often reusable containers to pack your food, ensuring it remains safe, fresh, and uncontaminated from our kitchen to your doorstep.',
            'Doorstep Delivery': 'Mummy Meals is dedicated to bringing the warmth of home-cooked food directly to you without hassle. Our reliable delivery partners ensure your tiffin arrives hot and fresh, exactly when you expect it. Track your delivery in real-time through our app and enjoy the convenience of delicious, homemade meals delivered daily to your home or office.'
        };

        
        const openModal = (title) => {
            if (!modalTitle || !modalText) { 
                 console.error("Modal title or text element not found!");
                 return;
            }
            modalTitle.textContent = title; 
            
            modalText.textContent = cardDetails[title] || "Details coming soon."; 
            modal.style.display = 'block'; 
            document.body.style.overflow = 'hidden'; 
            console.log(`Modal opened for: ${title}`);
        };
        
        const closeModal = () => {
            modal.style.display = 'none'; 
            
            document.body.style.overflow = 'auto'; 
            
            console.log('Modal closed.');
        };

        
        imageCardsForModal.forEach(card => {
            const titleElement = card.querySelector('h3'); 
            
            if (titleElement) {
                
                card.addEventListener('click', () => openModal(titleElement.textContent.trim()));
            }
        });

        
        if (closeBtn) {
            closeBtn.addEventListener('click', closeModal);
        }

        
        modal.addEventListener('click', (event) => {
            if (event.target === modal) {
                
                closeModal();
            }
        });

        
        window.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && modal.style.display === 'block') { 
                closeModal();
            }
        });

    } else {
        if (!modal) console.log('Modal (#cardModal) not found.');
        if (imageCardsForModal.length === 0) console.log('No image cards found for modal interaction.');
    }

}); 
