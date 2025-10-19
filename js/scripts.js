let aboutMeData = null;
let projectData = null;

document.addEventListener('DOMContentLoaded', async () => {
    try {
        await fetchAllData();
        myName();
        populateAboutMe()
        populateProjects();
        setupFormValidation();
    }
    catch (error) {
        console.error('Error initializing page:', error);
    }
});

async function fetchAllData() {
    try {
        const aboutMeResponse = await fetch('./../starter/data/aboutMeData.json');
        if (!aboutMeResponse.ok) {
            throw new Error('Failed to fetch About Me data');
        }
        aboutMeData = await aboutMeResponse.json();
        const projectResponse = await fetch('./../starter/data/projectsData.json');
        if (!projectResponse.ok) {
            throw new Error('Failed to fetch Projects data');
        }
        projectData = await projectResponse.json();
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
}
function myName(){
    const name = document.querySelector('h1');
    name.textContent = 'Somood Musleh';
}
function populateAboutMe() {
    try {
        const aboutMeContainer = document.getElementById('aboutMe');
        const fragment = document.createDocumentFragment();
        const bio = document.createElement('p');
        bio.textContent = aboutMeData.aboutMe || 'No bio available';
        const headshotContainer = document.createElement('div');
        headshotContainer.classList.add('headshotContainer');

        const headshotImg = document.createElement('img')
        let headshot = aboutMeData.headshot;
        if (typeof headshot === 'string' && headshot.includes('../images')) {
            headshot = headshot.replace('../images', './../starter/images');
        }
        headshotImg.src = headshot || './../starter/images/headshot.webp';
        headshotImg.alt = 'Profile headshot';

        headshotContainer.append(headshotImg);
        fragment.append(bio, headshotContainer);
        aboutMeContainer.append(fragment);
    } catch (error) {
        console.error('Error in populateAboutMe:', error);
    }
}

function populateProjects() {
    try {
        const projectContainer = document.getElementById('projectList');
        const fragment = document.createDocumentFragment();
        projectData.forEach((project) => {
            const card = createProjectCard(project);
            fragment.append(card);
        });
        projectContainer.append(fragment);

        if (projectData.length > 0) {
            updateSpotlight(projectData[0])
        }

        setupProjectNavigation()
    } catch (error) {
        console.error('Error in populateProjects:', error);
    }

}

function createProjectCard(project) {
    try {
        const card = document.createElement('div');
        card.classList.add('projectCard');
        card.id = project.project_id || '';

        let projectImageUpdate = project.card_image;
        if (typeof projectImageUpdate === 'string' && projectImageUpdate.includes('../images')) {
            projectImageUpdate = projectImageUpdate.replace('../images', './../starter/images');
        }
        const projectImage = projectImageUpdate || './../starter/images/card_placeholder_bg.webp';
        card.style.backgroundImage = `url(${projectImage})`;
        card.style.backgroundSize = 'cover';
        card.style.backgroundPosition = 'center';

        const title = document.createElement('h4');
        title.textContent = project.project_name || 'untitled project'

        const description = document.createElement('p');
        description.textContent = project.short_description || 'No description available';

        card.append(title, description);
        const handleProjectClick = (event) => {
            if (event.pointerType === 'touch' && event.pressure === 0) return;
            updateSpotlight(project);
        }
        card.addEventListener('pointerdown', handleProjectClick);

        return card
    }
    catch (error) {
        console.error('Error in createProjectCard:', error);
    }
}

function setupProjectNavigation() {
    try {
        const projectList = document.getElementById('projectList');
        const leftArrow = document.querySelector('.arrow-left');
        const rightArrow = document.querySelector('.arrow-right');

        if (!projectList || !leftArrow || !rightArrow) return;

        const getScrollAmount = () => {
            const isMobile = window.matchMedia('(max-width: 1023px)').matches;
            return isMobile ? 220 : 220; // card width + gap
        };

        const handleLeftScroll = (event) => {
            if (event.pointerType === 'touch' && event.pressure === 0) return;
            const scrollAmount = getScrollAmount();
            const isMobile = window.matchMedia('(max-width: 1023px)').matches;
            projectList.scrollBy({
                [isMobile ? 'left' : 'top']: -scrollAmount,
                behavior: 'smooth'
            });
        };

        const handleRightScroll = (event) => {
            if (event.pointerType === 'touch' && event.pressure === 0) return;
            const scrollAmount = getScrollAmount();
            const isMobile = window.matchMedia('(max-width: 1023px)').matches;
            projectList.scrollBy({
                [isMobile ? 'left' : 'top']: scrollAmount,
                behavior: 'smooth'
            });
        };

        leftArrow.addEventListener('pointerdown', handleLeftScroll);
        rightArrow.addEventListener('pointerdown', handleRightScroll);
    } catch (error) {
        console.error('Error in setupProjectNavigation: ', error)
    }
}

function updateSpotlight(project) {
    try {
        const spotlight = document.getElementById('projectSpotlight');
        const spotlightTitle = document.getElementById('spotlightTitles');

        let image = project.spotlight_image;
        if (typeof image === 'string' && image.includes('../images')) {
            image = image.replace('../images', './../starter/images');
        }
        const bgImage = image || './../starter/images/spotlight_placeholder_bg.webp';
        spotlight.style.backgroundImage = `url(${bgImage})`;
        spotlight.style.backgroundSize = 'cover';
        spotlight.style.backgroundPosition = 'center';

        spotlightTitle.innerHTML = '';
        const fragment = document.createDocumentFragment();

        const title = document.createElement('h3');
        title.textContent = project.project_name || 'untitled project';

        const description = document.createElement('p');
        description.textContent = project.long_description || 'No description available';

        const link = document.createElement('a');
        if (project.url) {
            link.href = project.url;
            link.textContent = 'Click here to see more...';
            link.target = '_blank';
        } else {
            link.textContent = 'More information coming soon...';
            link.style.pointerEvents = 'none';
            link.style.opacity = '0.6';
        }
        fragment.append(title, description, link);
        spotlightTitle.append(fragment)
    } catch (error) {
        console.error('Error in updateSpotlight: ', error);
    }
}

function setupFormValidation() {
    try {
        const form = document.getElementById('formSection');
        const emailInput = document.getElementById('contactEmail');
        const messageInput = document.getElementById('contactMessage');
        const charactersLeft = document.getElementById('charactersLeft');
        const emailError = document.getElementById('emailError');
        const messageError = document.getElementById('messageError');

        const handleMessageLength = (event) => {
            const length = messageInput.value.length;
            const maxLength = 300;
            charactersLeft.textContent = `Characters: ${length}/${maxLength}`;
            if (length > maxLength) {
                charactersLeft.classList.add('error');
            } else {
                charactersLeft.classList.remove('error');
            }
        };
        messageInput.addEventListener('input', handleMessageLength);


        const handleFormSubmit = (event) => {
            event.preventDefault();

            emailError.textContent = '';
            messageError.textContent = '';
            emailError.classList.remove('error');
            messageError.classList.remove('error');

            let isValid = true;

            const email = emailInput.value.trim();

            if (!email) {
                emailError.textContent = 'Email address is required.';
                emailError.classList.add('error');
                isValid = false;
            } else {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(email)) {
                    emailError.textContent = 'Please enter a valid email address (e.g., user@example.com).';
                    emailError.classList.add('error');
                    isValid = false;
                } else {
                    const illegalCharsRegex = /[^a-zA-Z0-9@._-]/;
                    if (illegalCharsRegex.test(email)) {
                        emailError.textContent = 'Email contains illegal characters. Only letters, numbers, @, ., _, and - are allowed.';
                        emailError.classList.add('error');
                        isValid = false;
                    }
                }
            }

            const message = messageInput.value.trim();
            if (!message) {
                messageError.textContent = 'Message is required.';
                messageError.classList.add('error');
                isValid = false;
            } else {
                const illegalCharsRegex = /[^a-zA-Z0-9@._-]/;
                if (illegalCharsRegex.test(message)) {
                    messageError.textContent = 'Message contains illegal characters. Only letters, numbers, @, ., _, and - are allowed.';
                    messageError.classList.add('error');
                    isValid = false;
                } else if (message.length > 300) {
                    messageError.textContent = 'Message must be 300 characters or less.';
                    messageError.classList.add('error');
                    isValid = false;
                }
            }

            if (isValid) {
                alert('Form validation passed! Your message has been submitted successfully.');
                form.reset();
                charactersLeft.textContent = 'Characters: 0/300';
                charactersLeft.classList.remove('error');
            }
        }
        form.addEventListener('submit', handleFormSubmit)

    } catch (error) {
        console.error('Error in setupFormValidation: ', error);
    }
}