
document.addEventListener('DOMContentLoaded', function () {

    // めもりと点
    var liens = document.querySelectorAll('.memori a[href^="#"], .tana_menu a[href^="#"]');
    if (!liens.length) return;

    // よこにスクロールするページ
    var rouka = document.querySelector('.rouka');

    // リンクと行き先の組
    var paires = [];
    
    for (var i = 0; i < liens.length; i++) {
        var cible = document.querySelector(liens[i].getAttribute('href'));
        if (cible) paires.push({ lien: liens[i], section: cible });
    }

    var observateur = new IntersectionObserver(function (entrees) {
        for (var i = 0; i < entrees.length; i++) {
            for (var j = 0; j < paires.length; j++) {
                if (paires[j].section === entrees[i].target) {
                    paires[j].lien.classList.toggle('ima', entrees[i].isIntersecting);
                }
            }
        }
    }, {
        root: rouka || null,
        // まん中のせまい帯だけ
        rootMargin: rouka ? '0px -45% 0px -45%' : '-45% 0px -45% 0px'
    });

    for (var k = 0; k < paires.length; k++) {
        observateur.observe(paires[k].section);
    }
});


/* 2. たてのホイール -> よこ移動 */

(function () {

    var rouka = document.querySelector('.rouka');
    if (!rouka) return;

    var verrou = false;

    rouka.addEventListener('wheel', function (e) {

        // よこの操作はそのまま
        if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;

        // たて移動を止める
        e.preventDefault();

        if (verrou) return;

        var largeur = rouka.clientWidth;
        var actuel  = Math.round(rouka.scrollLeft / largeur);
        var dernier = Math.round(rouka.scrollWidth / largeur) - 1;
        var cible   = actuel + (e.deltaY > 0 ? 1 : -1);

        if (cible < 0 || cible > dernier) return;   // はし

        verrou = true;   // 連打よけ
        rouka.scrollTo({ left: cible * largeur, behavior: 'smooth' });
        setTimeout(function () { verrou = false; }, 1200);

    });

})();


/* 3. 世界をひらく・とじる（works.html） */

document.querySelectorAll('.suisou').forEach(function (suisou) {

    var ouvrir = suisou.querySelector('.miru button');
    var tojiru = suisou.querySelector('.tojiru');

    if (ouvrir) ouvrir.addEventListener('click', function () {
        suisou.classList.add('hiraita');
    });

    if (tojiru) tojiru.addEventListener('click', function () {
        suisou.classList.remove('hiraita');
    });

});


/* 4. モザイクの1枚を大きく（works.html） */

document.querySelectorAll('.mozaiku').forEach(function (mozaiku) {

    var vignettes = mozaiku.querySelectorAll('figure');

    vignettes.forEach(function (vignette) {

        vignette.addEventListener('click', function () {
            var deja = vignette.classList.contains('ookii');

            vignettes.forEach(function (v) {
                v.classList.remove('ookii');
            });

            // もう一度で もどす
            if (deja) {
                mozaiku.classList.remove('erabi');
                mozaiku.style.gridTemplateRows = '';
            } else {
                vignette.classList.add('ookii');
                mozaiku.classList.add('erabi');
                // 明示グリッドが要る
                // minmax(0.1fraction)：はみ出しよけ
                // スマホは行を決めない（下にのびる）
                if (window.innerWidth > 767) {
                    mozaiku.style.gridTemplateRows =
                        'repeat(' + (vignettes.length - 1) + ', minmax(0, 1fr))';
                }
            }
        });

    });

});


/* 5. よみこみ中の画面を消す */

(function () {

    var ecran = document.querySelector('.yomikomi');
    if (!ecran) return;

    function finir() { ecran.classList.add('owari'); }

    // 画像もふくめて全部
    window.addEventListener('load', finir);

    // 保険：おそいときでも 12 秒で消す
    setTimeout(finir, 12000);

})();


/* 6. 上へもどるボタン */

(function () {

    var botan = document.querySelector('.ue_modoru');
    if (!botan) return;

    // 400px より下で出す
    function miseru() {
        botan.classList.toggle('mieru', window.scrollY > 400);
    }

    window.addEventListener('scroll', miseru);
    miseru();

    // 一番上へ
    botan.addEventListener('click', function () {
        window.scrollTo({ top: 0 });
    });

})();


/* 7. 夜モード */

(function () {

    var botan = document.querySelector('.yoru_botan');
    if (!botan) return;

    // 前に選んだもの
    document.body.classList.toggle('yoru', localStorage.getItem('yoru') === 'on');

    botan.addEventListener('click', function () {
        var on = document.body.classList.toggle('yoru');
        localStorage.setItem('yoru', on ? 'on' : 'off');
    });

})();


/* 8. スマホのメニュー */

(function () {

    var botan = document.querySelector('.menu_botan');
    var nav = document.querySelector('.header_nav');
    if (!botan) return;

    botan.addEventListener('click', function () {
        document.body.classList.toggle('menu_hiraita');
    });

    // うしろの幕かリンクをおしたら とじる
    nav.addEventListener('click', function (e) {
        if (e.target === nav || e.target.tagName === 'A') {
            document.body.classList.remove('menu_hiraita');
        }
    });

})();


/* 9. 本のリストをひらく（works.html・スマホ） */

document.querySelectorAll('.hon_botan').forEach(function (botan) {

    var hon = botan.closest('.mozaiku_hon');

    botan.addEventListener('click', function (e) {
        e.stopPropagation();          // 下の「そとをおす」とぶつからないように
        hon.classList.toggle('hon_hiraita');
    });

});

// そとをおしたら とじる
document.addEventListener('click', function (e) {

    document.querySelectorAll('.hon_hiraita').forEach(function (hon) {
        if (!hon.querySelector('ul').contains(e.target)) {
            hon.classList.remove('hon_hiraita');
        }
    });

});
