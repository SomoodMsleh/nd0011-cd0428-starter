let aboutMeData = null;
let projectData = null;

document.addEventListener('DOMContentLoaded', async () => {
    try {
        await fetchAllData();
        populateAboutMe()
        populateProjects();
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

function populateAboutMe() {
    try {
        const aboutMeContainer = document.getElementById('aboutMe');
        aboutMeContainer.innerHTML = '';
        const Fragment = document.createDocumentFragment();
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
        Fragment.append(bio, headshotContainer);
        aboutMeContainer.append(Fragment);
    } catch (error) {
        console.error('Error in populateAboutMe:', error);
    }
}

function populateProjects() {
    try {
        const projectContainer = document.getElementById('projectList');
        aboutMeContainer.textContent = '';
        const Fragment = document.createDocumentFragment();
        projectData.forEach((project) => {
            const card = createProjectCard(project);
            Fragment.append(card);
        });
        projectContainer.append(Fragment);
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

function updateSpotlight(project) {
    try {

    } catch (error) {
        console.error('Error in updateSpotlight:', error);
    }
}
