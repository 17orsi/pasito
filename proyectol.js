let points = 0;
        const maxDailyPoints = 10000;
        let currentUser = null;


        function toggleTheme() {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const themeBtn = document.getElementById('themeToggleBtn');
           
            if (currentTheme === 'light') {
                document.documentElement.removeAttribute('data-theme');
                themeBtn.innerText = '🌙';
            } else {
                document.documentElement.setAttribute('data-theme', 'light');
                themeBtn.innerText = '☀️';
            }
        }


        const usersData = [
            {
                name: "Mateo González",
                year: "5to Año",
                orientation: "Computación",
                pts: 9500,
                starsStr: "★★★★★",
                starsCount: 5,
                isOnline: true,
                goodDesc: "Explicación clara de algoritmos y resolución de código paso a paso.",
                badDesc: "Me cuesta memorizar fechas largas para exámenes de Historia.",
                subjectRatings: [
                    { name: "Algoritmo", stars: "★★★★★ (5/5)" },
                    { name: "Matemática", stars: "★★★★☆ (4/5)" },
                    { name: "Física", stars: "★★★★☆ (4/5)" }
                ],
                goodTags: ["Algoritmo", "Matemática", "Física"],
                badTags: ["Historia"]
            },
            {
                name: "Lucía Fernández",
                year: "4to Año",
                orientation: "Computación",
                pts: 7500,
                starsStr: "★★★★☆",
                starsCount: 4,
                isOnline: false,
                goodDesc: "Te ayudo a armar consultas SQL y diagrama de bases de datos.",
                badDesc: "Necesito apoyo urgente para aprobar el práctico de Química.",
                subjectRatings: [
                    { name: "Base de Datos", stars: "★★★★★ (5/5)" },
                    { name: "Lógica Computacional", stars: "★★★★☆ (4/5)" },
                    { name: "Inglés", stars: "★★★★☆ (4/5)" }
                ],
                goodTags: ["Base de Datos", "Inglés", "Lógica Computacional"],
                badTags: ["Química"]
            },
            {
                name: "Lucas Benítez",
                year: "4to Año",
                orientation: "Motores",
                pts: 6000,
                starsStr: "★★★☆☆",
                starsCount: 3,
                isOnline: true,
                goodDesc: "Dominio de planos de taller, motores térmicos y cálculo técnico.",
                badDesc: "Tengo dificultades en redacción de ensayos de Lengua.",
                subjectRatings: [
                    { name: "Dibujo Técnico", stars: "★★★★★ (5/5)" },
                    { name: "Física", stars: "★★★☆☆ (3/5)" }
                ],
                goodTags: ["Dibujo Técnico", "Física"],
                badTags: ["Lengua"]
            }
        ];


        function checkYearOrientation() {
            const year = document.getElementById('userYear').value;
            const orientationGroup = document.getElementById('orientationGroup');
           
            if (year.includes("4to") || year.includes("5to") || year.includes("6to")) {
                orientationGroup.style.display = 'flex';
            } else {
                orientationGroup.style.display = 'none';
            }
        }


function handleAuth(e) {
            if (e && typeof e.preventDefault === 'function') {
                e.preventDefault();
            }

            const usernameInput = document.getElementById('username').value;
            const yearInput = document.getElementById('userYear').value;
            const roleInput = document.getElementById('userRole').value;

            let orientationInput = "";
            if (yearInput.includes("4to") || yearInput.includes("5to") || yearInput.includes("6to")) {
                orientationInput = document.getElementById('userOrientation').value;
            }

            const goodCheckboxes = document.querySelectorAll('#goodSubjectsGrid input[type="checkbox"]:checked');
            const goodSubjects = Array.from(goodCheckboxes).map(cb => cb.value);

            if (goodSubjects.length < 3) {
                alert("Por favor selecciona al menos 3 materias en las que sos bueno.");
                return false;
            }

            const badCheckboxes = document.querySelectorAll('#badSubjectsGrid input[type="checkbox"]:checked');
            const badSubjects = Array.from(badCheckboxes).map(cb => cb.value);

            const goodDesc = document.getElementById('goodDesc').value;
            const badDesc = document.getElementById('badDesc').value;

            currentUser = {
                name: usernameInput,
                year: yearInput,
                orientation: orientationInput,
                role: roleInput,
                goodTags: goodSubjects,
                badTags: badSubjects,
                goodDesc: goodDesc,
                badDesc: badDesc,
                isOnline: true
            };

            const authOverlay = document.getElementById('authOverlay');
            if (authOverlay) {
                authOverlay.style.display = 'none';
            }

            document.getElementById('profileUsername').innerText = currentUser.name;
            const displayYearStr = currentUser.orientation ? `${currentUser.year} (${currentUser.orientation})` : currentUser.year;
            document.getElementById('profileYear').innerText = displayYearStr;
            document.getElementById('profileRole').innerText = currentUser.role;
            document.getElementById('roleDisplay').innerText = `${currentUser.role} - ${displayYearStr}`;

            renderTags('profileGoodTags', currentUser.goodTags, false);
            renderTags('profileBadTags', currentUser.badTags, true);

            document.getElementById('profileGoodDescText').innerText = `"${currentUser.goodDesc}"`;
            document.getElementById('profileBadDescText').innerText = `"${currentUser.badDesc}"`;

            updateLibritosAndPoints();
            return false;
        }


        function renderTags(containerId, tagsArray, isBad = false) {
            const container = document.getElementById(containerId);
            container.innerHTML = '';
            tagsArray.forEach(tag => {
                const tagSpan = document.createElement('span');
                tagSpan.className = isBad ? 'tag tag-bad' : 'tag';
                tagSpan.innerText = tag;
                container.appendChild(tagSpan);
            });
        }


        function logout() {
            currentUser = null;
            document.getElementById('authOverlay').style.display = 'flex';
        }


        function completeTask(button, amount) {
            if (points + amount <= maxDailyPoints) {
                points += amount;
            } else {
                points = maxDailyPoints;
            }


            updateLibritosAndPoints();


            button.innerText = 'Hecho ✓';
            button.style.backgroundColor = 'var(--success)';
            button.style.borderColor = 'var(--success)';
            button.style.color = '#000';
            button.disabled = true;
        }


        function updateLibritosAndPoints() {
            const libritos = Math.floor(points / 1000);


            document.getElementById('totalPoints').innerText = points;
            document.getElementById('libritosCount').innerText = libritos;
            document.getElementById('profileLibritos').innerText = `📚 ${libritos} Librito(s)`;
            document.getElementById('profilePts').innerText = points + ' Pts';


            const barHeight = (points / maxDailyPoints) * 110;
            document.getElementById('todayBar').style.height = barHeight + 'px';
            document.getElementById('todayVal').innerText = points >= 1000 ? (points/1000).toFixed(1) + 'k' : points;


            const stars = document.getElementById('starsContainer').children;
            const starsCount = Math.floor((points / maxDailyPoints) * 5);
            for (let i = 0; i < 5; i++) {
                if (i < starsCount) {
                    stars[i].classList.add('active');
                } else {
                    stars[i].classList.remove('active');
                }
            }
        }


        function toggleStatus() {
            const statusVal = document.getElementById('statusSelect').value;
            const statusText = document.getElementById('profileStatusText');
           
            if (statusVal === 'online') {
                currentUser.isOnline = true;
                statusText.innerHTML = '<span class="status-dot status-online"></span>Disponible';
            } else {
                currentUser.isOnline = false;
                statusText.innerHTML = '<span class="status-dot status-offline"></span>Ocupado';
            }
        }


        function switchTab(tabId, element) {
            document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
            document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));


            document.getElementById(tabId).classList.add('active');
            element.classList.add('active');


            if (tabId === 'view-social') {
                filterUsers();
            }
        }


        function filterUsers() {
            const query = document.getElementById('searchInput').value.toLowerCase();
            const minStars = parseInt(document.getElementById('filterStars').value);
            const yearVal = document.getElementById('filterYear').value;
            const orientVal = document.getElementById('filterOrientation').value;


            const container = document.getElementById('usersListContainer');
            container.innerHTML = '';


            const filtered = usersData.filter(user => {
                const matchNameOrTag = user.name.toLowerCase().includes(query) ||
                                       user.goodTags.some(t => t.toLowerCase().includes(query));
                const matchStars = user.starsCount >= minStars;
                const matchYear = yearVal === 'all' || user.year === yearVal;
                const matchOrient = orientVal === 'all' || user.orientation === orientVal;


                return matchNameOrTag && matchStars && matchYear && matchOrient;
            });


            filtered.forEach(user => {
                const userCard = document.createElement('div');
                userCard.className = 'user-item';
                userCard.onclick = () => openUserProfile(user);


                const statusDot = user.isOnline
                    ? '<span class="status-dot status-online"></span>En línea'
                    : '<span class="status-dot status-offline"></span>Ocupado';


                let goodTagsHtml = user.goodTags.map(t => `<span class="tag">${t}</span>`).join('');


                userCard.innerHTML = `
                    <div class="user-header">
                        <div class="user-details">
                            <span class="user-name">${user.name} (${user.year}${user.orientation ? ' - ' + user.orientation : ''})</span>
                            <span style="font-size: 0.72rem; color: var(--text-muted);">${statusDot}</span>
                        </div>
                        <div class="user-rep">${user.starsStr}</div>
                    </div>
                    <div style="font-size: 0.75rem; color: var(--text-dark);">
                        <strong>Sabe:</strong> ${user.goodDesc}
                    </div>
                    <div class="tags-container">
                        ${goodTagsHtml}
                    </div>
                `;
                container.appendChild(userCard);
            });
        }


        function openUserProfile(user) {
            document.getElementById('modalUserName').innerText = user.name;
            document.getElementById('modalUserYear').innerText = `${user.year} ${user.orientation ? '(' + user.orientation + ')' : ''}`;
            document.getElementById('modalUserRep').innerText = user.starsStr;
            document.getElementById('modalUserStatus').innerHTML = user.isOnline
                ? '<span class="status-dot status-online"></span>Disponible para ayudar'
                : '<span class="status-dot status-offline"></span>No disponible';


            const ratingsContainer = document.getElementById('modalSubjectRatings');
            ratingsContainer.innerHTML = '';
            user.subjectRatings.forEach(item => {
                const row = document.createElement('div');
                row.style.display = 'flex';
                row.style.justifyContent = 'space-between';
                row.innerHTML = `<span>${item.name}:</span> <strong style="color: var(--accent-yellow);">${item.stars}</strong>`;
                ratingsContainer.appendChild(row);
            });


            document.getElementById('modalGoodDesc').innerText = `"${user.goodDesc}"`;
            document.getElementById('modalBadDesc').innerText = `"${user.badDesc}"`;


            const badTagsContainer = document.getElementById('modalBadTags');
            badTagsContainer.innerHTML = '';
            user.badTags.forEach(t => {
                const tagSpan = document.createElement('span');
                tagSpan.className = 'tag tag-bad';
                tagSpan.innerText = t;
                badTagsContainer.appendChild(tagSpan);
            });


            document.getElementById('userModal').classList.add('active');
        }


        function closeUserProfile() {
            document.getElementById('userModal').classList.remove('active');
        }
        let currentRewardPoints = 0;


    function openRewardModal(nombrePremio, puntosRequeridos) {
        document.getElementById('rewardModalTitle').innerText = nombrePremio;
        document.getElementById('rewardPointsTxt').innerText = puntosRequeridos;
        currentRewardPoints = puntosRequeridos;


        document.getElementById('rewardStep1').style.display = 'block';
        document.getElementById('rewardStep2').style.display = 'none';
        document.getElementById('rewardStepError').style.display = 'none';


        document.getElementById('rewardModal').classList.add('active');
    }


    function closeRewardModal() {
        document.getElementById('rewardModal').classList.remove('active');
    }


    function generateRewardCode() {
        if (typeof points !== 'undefined' && points < currentRewardPoints) {
            document.getElementById('rewardErrorMsg').innerText = `Necesitás ${currentRewardPoints} pts y tenés ${points} pts.`;
            document.getElementById('rewardStep1').style.display = 'none';
            document.getElementById('rewardStep2').style.display = 'none';
            document.getElementById('rewardStepError').style.display = 'block';
            return;
        }


        if (typeof points !== 'undefined') {
            points -= currentRewardPoints;
            if (typeof updateLibritosAndPoints === 'function') {
                updateLibritosAndPoints();
            }
        }


        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let p1 = '', p2 = '';
        for(let i = 0; i < 4; i++) {
            p1 += chars.charAt(Math.floor(Math.random() * chars.length));
            p2 += chars.charAt(Math.floor(Math.random() * chars.length));
        }
       
        document.getElementById('rewardGeneratedCode').innerText = `LIB-${p1}-${p2}`;
        document.getElementById('rewardStep1').style.display = 'none';
        document.getElementById('rewardStep2').style.display = 'block';
        document.getElementById('rewardStepError').style.display = 'none';
    }
