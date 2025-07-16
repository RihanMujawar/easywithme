const sliderImages = [
  "https://img.freepik.com/premium-photo/cool-cat-wearing-pink-sunglasses-with-neon-light-background_514761-16858.jpg",
  "https://thumbs.dreamstime.com/b/cool-wallpapers-backgrounds-check-out-our-68126782.jpg",
  "https://wallpapers.com/images/featured/super-cool-pictures-h943jt67w6kqn4e6.jpg"
];
function changeImg(index) {
  document.getElementById('slideImg').src = sliderImages[index];
}