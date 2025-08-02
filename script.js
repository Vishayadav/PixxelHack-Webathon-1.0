new fullpage('#fullpage', {
  navigation: false,
  verticalCentered: true,
  sectionsColor: [],
  autoScrolling: true,
  scrollingSpeed: 1000,
  responsiveWidth: 768,
  onLeave: function(origin, destination, direction){
    const img = destination.item.querySelector('img');
    gsap.fromTo(img, {opacity:0, y:50}, {opacity:1, y:0, duration:1});
  }
});

// Auto-advance sections every 4 seconds
setInterval(() => fullpage_api.moveSectionDown(), 4000);
