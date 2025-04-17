

document.addEventListener('DOMContentLoaded', () => {
    console.log('Mummy Meals Website Loaded'); 
    const handleOTPSimulation = (event) => {
        alert('OTP sent! (This is a demo - no real OTP sent)');
        if (event.target.tagName === 'BUTTON') {
            event.target.disabled = true;
            setTimeout(() => { event.target.disabled = false; }, 5000);
        }
    };
    const otpButtons = document.querySelectorAll('.btn-otp');
    if (otpButtons.length > 0) {
        console.log(`Found ${otpButtons.length} OTP button(s) on the page.`);
        otpButtons.forEach(button => { button.addEventListener('click', handleOTPSimulation); });
    } else {
        console.log('No OTP buttons (.btn-otp) found on this page.');
    }


    const handleSmoothScroll = (event) => {
        const targetId = event.currentTarget.getAttribute('href');
        if (targetId && targetId.startsWith('#')) {
            event.preventDefault();
            const targetElement = document.querySelector(targetId);
            if (targetElement) { targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
        }
        
    };
    const scrollLinks = document.querySelectorAll('a.smooth-scroll');
    if (scrollLinks.length > 0) {
        console.log(`Found ${scrollLinks.length} smooth scroll links on the page.`);
        scrollLinks.forEach(link => { link.addEventListener('click', handleSmoothScroll); });
    } else {
        console.log('No smooth scroll links (.smooth-scroll) found on this page.');
    }



    console.log('Attempting to initialize Infinite Slider...');
    const sliderContainer = document.querySelector('.image-slider-container');
    if (sliderContainer) {
        console.log('Found slider container (.image-slider-container).');
        const sliderTrack = sliderContainer.querySelector('.slider-track');
        const prevButton = sliderContainer.querySelector('#slider-prev');
        const nextButton = sliderContainer.querySelector('#slider-next');
        let originalSlides = sliderTrack ? Array.from(sliderTrack.children).filter(el => el.classList.contains('slide') && !el.classList.contains('clone')) : [];

        if (sliderTrack && prevButton && nextButton && originalSlides.length > 0) {
            console.log(`Found ${originalSlides.length} original slides for infinite slider.`);
            const slideInterval = 4000; 
            const transitionSpeed = 500; 
            
            const firstClone = originalSlides[0].cloneNode(true);
            firstClone.classList.add('clone');
            const lastClone = originalSlides[originalSlides.length - 1].cloneNode(true);
            lastClone.classList.add('clone');

            sliderTrack.appendChild(firstClone);
            sliderTrack.insertBefore(lastClone, originalSlides[0]);

            let allSlides = sliderTrack.querySelectorAll('.slide');
            const totalSlidesIncludingClones = allSlides.length;
            console.log(`Total elements in track: ${totalSlidesIncludingClones}`);

            let currentIndex = 1; 
            let slideTimer = null;
            let isTransitioning = false;


            sliderTrack.style.width = `${totalSlidesIncludingClones * 100}%`;
            allSlides.forEach(slide => {
                slide.style.width = `${100 / totalSlidesIncludingClones}%`;
            });


            sliderTrack.style.transition = 'none';
            sliderTrack.style.transform = `translateX(-${currentIndex * (100 / totalSlidesIncludingClones)}%)`;


            function moveToSlide(index, useTransition = true) {
                if (isTransitioning) return;
                isTransitioning = true;
                console.log(`Slider moving to index: ${index}`);
                const offset = -(index * (100 / totalSlidesIncludingClones));
                sliderTrack.style.transition = useTransition ? `transform ${transitionSpeed / 1000}s ease-in-out` : 'none';
                sliderTrack.style.transform = `translateX(${offset}%)`;
                currentIndex = index;


                setTimeout(() => {
                    handleCloneJump();
                    isTransitioning = false;
                }, useTransition ? transitionSpeed : 0);
            }


            function handleCloneJump() {
                if (currentIndex === 0) { 
                    console.log('Slider Jump: Last clone -> Actual last');
                    sliderTrack.style.transition = 'none'; 
                    currentIndex = totalSlidesIncludingClones - 2; 
                    sliderTrack.style.transform = `translateX(-${currentIndex * (100 / totalSlidesIncludingClones)}%)`;
                } else if (currentIndex === totalSlidesIncludingClones - 1) { 
                    console.log('Slider Jump: First clone -> Actual first');
                    sliderTrack.style.transition = 'none'; 
                    currentIndex = 1; 
                    sliderTrack.style.transform = `translateX(-${currentIndex * (100 / totalSlidesIncludingClones)}%)`;
                }
            }
            
            function nextSlide() { if (!isTransitioning) moveToSlide(currentIndex + 1); }
            function prevSlide() { if (!isTransitioning) moveToSlide(currentIndex - 1); }
            function startSlider() { stopSlider(); slideTimer = setInterval(nextSlide, slideInterval); console.log("Slider interval started."); }
            function stopSlider() { clearInterval(slideTimer); console.log("Slider interval stopped."); }


            nextButton.addEventListener('click', () => { stopSlider(); nextSlide(); startSlider(); });
            prevButton.addEventListener('click', () => { stopSlider(); prevSlide(); startSlider(); });
            sliderContainer.addEventListener('mouseenter', stopSlider); 
            sliderContainer.addEventListener('mouseleave', startSlider); 
            setTimeout(() => {
                 sliderTrack.style.transition = `transform ${transitionSpeed / 1000}s ease-in-out`;
                 startSlider();
            }, 50); 

        } else {
            console.error("Infinite Slider Error: Required elements missing (track, buttons, or slides). Check HTML structure.");
        }
    } else {
        console.log("Slider container (.image-slider-container) not found. Skipping infinite slider setup.");
    }
  

   

}); 
