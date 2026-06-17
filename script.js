const cosmeticslist = [
    {
        id: 1,
        brand: "Shik",
        name: "Карандаш для губ",
        type: "lips",
        rating: 5,
        comment: "Очень стойкий карандаш, держится весь день и не сушит губы."
    },
    {
        id: 2,
        brand: "Darling*",
        name: "Тени для глаз",
        type: "eyes",
        rating: 4,
        comment: "Хорошо наносятся, не вызывают раздражения."
    }
];
console.log("Моя база данных косметики:", cosmeticslist);

const catalogDiv = document.getElementById("catalog");

cosmeticslist.forEach(function(product) {
    const card = document.createElement("div");
    card.classList.add("cosmetic-card");

    card.innerHTML = `
        <h3>${product.brand} — ${product.name}</h3>
        <p><strong>Категория:</strong> ${product.type}</p>
        <p><strong>Оценка:</strong> ${product.rating}/5 ⭐</p>
        <p><strong>Отзыв:</strong> ${product.comment}</p>
    `;

    catalogDiv.appendChild(card);
});