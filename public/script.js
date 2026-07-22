const annee = new Date().getFullYear();
const cible = document.getElementById('annee-courante');

if (cible) {
  cible.textContent = annee;
}
