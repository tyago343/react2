# React I

## Overview

### Trayectoria

Este es el primero en una serie de workshops diseñados para incrementar tus conocimientos de ReactJS. Durante el curso de los siguientes dias, vamos a construir un clon de Spotify, al cual hemos llamado **Juke**. A medida que nuestra aplicación crece, vamos a aprender las herramientas del ecosistema de React, que nos va a ayudar manejar complejidad y preparar nuestra app para escalar!

### Este Workshop

En este workshop te vamos a dar un servidor funcionando por una base de datos de música. Vas a armar un sitio donde los usuarios puedan buscar y reproducir las canciones de un album. Al hacer esto, vas a aprender sobre lifecycle de los componentes de React, state y props, trabajando con HTML5 audio, y mucho más.

## Empezando

### Punto de Arranque

Para este workshop, necesitas tener una versión de Node 6+. Recomendamos usar el módulo npm llamado [n](https://github.com/tj/n) para cambiar facilmente de versiones de Node. Cambia a una version de Node 6+ ahora si todavía no lo estas. Para fijarte la version de Node que estas corriendo en este momento solamente tienes que correr `node -v`.

Forkea [este repo](http://github.com/atralice/react-workshop-I), clona y corre `npm install`. Vamos a empezar con un backend funcionando, completamente, con sus rutas, modelos e incluso un seed para los archivos mp3 (en el archivo `bin/seed`). De hecho, nuestra base de datos no tendrá nada de música en ella hasta que corras ese seed (más adelante).

---

> **Nota para usuarios Linux:** Si recibis el error `You need to install postgresql-server-dev-X.Y for building a server-side extension or libpq-dev for building a client-side application`. Tenés que correr `sudo apt-get install libpq-dev` y tratar `npm install` nuevamente.

### Seed

**Importante:** Para el archivo del seed funcione, necesitas usar **Node 6.0.0** o mayor. Podes chequear tu versiñon de node escribiendo `node -v` en tu consola.

---

El seed script de Juke incluye alrededor de 40 tracks. Ademas, Juke soporta seedear de la librería de Itunes.

Desde la raiz del proyecto corré:

```
npm run seed
```

Si todo sale bien, deberías eventualmente ver un reporte que todo se seedeó, y tener otra vez el prompt del shell. Ahora hacé `npm start`, y confirma que tu API esta funcionando visitando http://localhost:1337/api/albums/1 (deberías ver JSON). Si te gustaría usar una librería de iTunes, tendrás que hacer lo siguiente:

#### Agregando Música de tu Librería Itunes (Opcional)

Si estas utilizando una versión mas nueva de iTunes, por ahí necesites hacer los siguientes pasos para crear tu `iTunes Music Library.xml`

1. Abrir iTunes
1. En el menu de opciones selecciona `iTunes -> Preferencias`
1. En las `Preferencias` selecciona el panel `Avanzado`.
1. Debería haber una opción que diga `Compartir Archivo XML de la biblioteca de iTunes con otras apps`. Asegurate que este chequeado.

Ahora podes volver a correr el script para seedear la base de datos.

## Basic React App

### Webpack

Con React, podemos tomar ventaja de una syntaxis especial llamada `JSX` para escribir Javascript que se parece bastante a HTML. Sin embargo, nuestro interprete de Javascript, no sabe como leer JSX por su cuenta. Hasta ahora, hemos escrito JavaScript que es seguro para que nuestro browser lo corra sin ningún tratamiento especial, pero si querríamos utilizar JSX, necesitamos otra herramienta que tome nuestro JSX, lo parsee, y lo transpile a Javscript normal.

Nuestra herramienta elegida para esta tarea es `Webpack`. Webpack es un muy poderoso y altamente configurable `module builder` que puede leer nuestros archivos JavaScript, parsear sintaxis especial, como JSX, y darnos un solo archivo JavaScript, con todo nuestro código transpilado de tal forma que nuestro interprete de JavaScript pueda entenderlo (incluyendo todos los modulos de nuestas dependencias también).

Aquí hay solo alguna de las cosas que webpack puede hacer y hará para nosotros:

1. Interpretar JSX y convertirlo a JavaScript normal. 
1. Interpretar sintaxis ES6 y convertirla en Javascript ES5 para que browsers menos avanzados puedan correr nuestro código.
1. Agrupar todo nuestro código y cualquier modulo que requiramos a un solo archivo JavaScript, para que nuestro `index.html` solo necesite incluir un script tag para cargar toda nuestra aplicación.

Habiendo dicho esto, webpack tiene la desventaja de ser bastante complejo, y su [documentación](https://webpack.github.io/) puede ser frustrantemente opaca. Por ahora, todo lo que necesitas saber es que cuando corres `npm start`, el `start` script en nuestro `package.json` va a correr `webpack` que va a causar todo nuestro Javascript se construya en un solo archivo en nuestro directorio `public` llamado bundle.js.

Eso debería ser suficiente para que puedas comenzar, pero si querés aprender un poco más sobre como webpack sabe que hacer, aquí hay una breve descomposición del archivo de configuración que webpack esta utilizando para construir tu proyecto, llamado `webpack.config.js`.

```js
// La exportación es un objeto de configuración que le dice a webpack que hacer
module.exports = {

  // La propiedad `entry` le dice a webpack donde empieza nuestra apliación.
  // Webpack va a empezar a construir este archivo y todos los subsiguientes archivos que sean importados por este mismo.
  entry: './browser/react/index.js',

  // El `output` especifica donde el resultado de webpack va a ir. En este caso, hemos especificado
  // que debería ponerlo en un archivo llamado `bundle.js` en nuestro directorio `public`
  output: {
    path: __dirname,
    filename: './public/bundle.js'
  },

  // El `context`simplemente setea el contexto para paths relativos
  context: __dirname,
  // Genera un error stack en base a nuestros archivos y no al bundle(que sería inentendible)
  devtool: 'source-map',
  // aqui le queremos decir que resuelva los archivos que tienen extensiones .js y .jsx
  // sin necesidad de aclarar la extension para que podamos hacer:
  // var Main = require('./Main') en archivos jsx también
  resolve: {
    extensions: ['.js', '.jsx']
  },
  // Aquí es donde especificamos que tipo de sintaxis especial webpack debería buscar.
  module: {
    // Loaders son modulos node especiales que hemos instalado que saben como parsear cierta sintaxis
    // Hay loaders para todo tipo de sintaxis
    loaders: [
      {
        // Aqui queremos testear y ver si algun archivo termina con la extensión .js o .jsx
        // Solo archivos que matcheen este criterio van a ser parseadas por este loader.
        test: /jsx?$/,
        // Queremos que webpack ignore cualquier cosa en el directorio node_modules o bower_components.
        // Esto es muy importatne - modulos tienen una responsabilidad de construir sus propios archivos js.
        // Si llegamos a hacer esto nosotros mismos, buildear nuestro bundle.js llevaría mucho!
        exclude: /(node_modules|bower_components)/,
        // Estamos usando el modulo babel-loader para leer nuestros archivos - puede manejar ambos ES6 y JSX!
        loader: 'babel-loader',
        // Aquí le decimos a webpack que busque por cualquier sintaxis de ES6 y JSX.
        //Si la encuentra, el babel-loaderva a transpilarlo por nosotros!
        query: {
          presets: ['react', 'es2015']
        }
      }
    ]
  }
};
```

### Modulos

Porque Webpack es un `module-builder` todas nuestros archivos js actuan como módulos. Esto significa que cualquier variable o función que declaremos esta restringido a ese módulo, como en Node! Esto es una gran ventaja!

Esto signifíca que podemos usar `require` para importar otros módulos a nuestro archivo, y podemos exportar usando `module.exports`!

```js
const React = require('react');

class Main extends React.Component {
  /** Hello world! **/
}
module.exports = Main;
```

También tenemos otra opción. Podemos usar los keywords `import`y `export` que fueron especificados en ES6.

```js
// usa `import...from` en vez de `require`
import React from 'react';

// deci `export` o `export default` en vez de `module.exports`
export default class Main extends React.Component {
  /** Hello world! **/
}
```

La sintaxis de import de ES6 permite algo parecido a la [destructuración de objetos](https://developer.mozilla.org/es/docs/Web/JavaScript/Referencia/Operadores/Destructuring_assignment) para extraer valores específicos del módulo que estamos importando. Por ejemplo, en vez de decir `React.Component`, podríamos extraer `Component`del modulo de React:

```js
// usa {} para estraer el valor, y separar cualquier valor con comas
import React, { Component } from 'react';

// Ahora podemos simplemente decir Component
export default class Main extends Component {
  /** Hello world! **/
}
```

Con `export`, también tenemos una elección: cada módulo puede tener un solo `default` export, como cualquier número de exports normales. La única diferencia es que cuando importamos el módulo, cualquier exportación que no sea la `default` tiene que estar entre llaves:

```js
/** ourExports.js */

// exportamos foo y bar
export const foo = 1;
export const bar = 'hello world';

//  exportamos por default baz
const baz = () => console.log('goodbye world!');
export default baz;
```

```js
 /** ourImports.js */

// Podemos importar `baz` por defecto sin usar llaves
import baz, { foo, bar } from './ourExports.js';
// `foo` y `bar`, sin embargo, tienen que estar entre llaves
```

### Cargando nuestro JS

Anda a la página http://localhost:1337/. Deberías ver un layout simple con un sidebar, un area para el contenido principal, y un footer.

Ahora mismo esto no es nada mas que HTML estático, pero vamos a usar React para renderizar nuestra vista en cambio! Abre `browser/index.html` y comentá todo de `<body>` por ahora, y solo incluí un div vacio, como este:

```html
<div id="app"></div>
```

Asegurate de darle el id "app". Cuando nuestro código de React corrá, va a encontrar este div y renderizar nuestro view en él!

Para poner nuestro código, necesitamos poner un `script` tag al path de nuestro `bundle.js`. Recordá de agregar el tag al final del body.

```html
<script src="/bundle.js"></script>
```

Matá el servidor, y corre `npm start` otra vez. Si el sidebar y footer desaparecen y ves las palabras 'Hello React' loggeado en la consola del cliente, entonces estas listo para continuar!

### Hello World

Ahora, nuestro `browser/react/index.js` simplemente dice hello a la consola del browser. Usemos React y pongamos nuestro saludo donde el mundo lo pueda ver!

Esto es lo que haremos.

1. Importa `React` de nuestro modulo `react`. (Recordá que podes hacer `import React from 'react'` o `const React = require('react')`).
1. Importa `ReactDOM` de nuestro modulo `react-dom`.
1. Usa la función `render` de ReactDOM para renderizar "Hello World" al DOM. Recordá que este método toma dos argumentos:
    - El Primer argumento es JSX(que parece HTML). Es importante que recuerdes que solo podés tener un elemento raiz en tu JSX!
    - Un nodo del DOM para renderizar la vista. Usando `document.getElementById`, podemos seleccionar el div que colocamos en nuestro `index.html`.

Cuando hayamos terminado, anda a la ventana del browser y refreshea la página y mira lo que ves . (No hay necesidad de resetear el servidor; Webpack va a rebuildear tu `bundle.js`cada vez que guardes cambios).

Luego de que hayas terminado, mira tu archivo `bundle.js` dentro de `public/` y mira como Webpack cambió tu `JSX` a código JavaScript.

### Crea un Componente

Mientras que la librería `ReactDOM` contiene otros métodos para lidear con el verdadero DOM, generalmente lo usamos solamente para definir el punto de entrada a nuestra app de React. En vez de escribir JSX al metodo `ReactDOM.render` directamente, escribamos un nuevo componente que sirva como el "componente raiz" de nuestra app.

1. En tu carpeta `browser/react`, crea un nuevo archivo jsx con el nombre de nuestro componente (algo como `Main.jsx` puede ser apropiado).
2. Importa React.
  - _¿Otra vez? ¿No habiamos importado React ya?_ Es verdad, pero no te olvides que Webpack es un `module builder`. Esto significa que cada archivo js que creamos actua como un módulo aislado, de la misma manera que un módulo funciona en Node! Por lo tanto no necesitamos preocuparnos sobre contaminar el objeto `window`. Cualquier variable que declaremos son locales a ese modulo, y si las queremos usar en otra parte, necesitamos exportarlo e importarlo.
3. Crea y exporta una clase que extienda de `React.Component`.
4. Define un método `render` en la clase que retorne JSX (recuerda, solo on elemento raiz esta permitido). Recomiendo empezar con lo siguiente:
```html
<div id="main" className="container-fluid">
  <h1>Hello world!</h1>
</div>
```
  - Fijate que necesitamos decir `className` en vez de `class`! ¿[Recuerdas por qué](https://reactjs.org/docs/introducing-jsx.html#specifying-children-with-jsx)?
5. Importa nuestra clase al nuestro archivo `index.js` y daselo como primer parametro a `ReactDOM.render`.
  - Nota que es importante para los componentes que escribas que empiecen con mayuscula, como `<App />`o `<Main />`. Esto es como React ve la diferencia entre classes de React y elementos de React (como `div`, `span`, `a`, `h1`, etc.).

### Un Componente con Estado

Cuando usamos `Nunjucks`, interpolabamos nuestra data a un template que se renderizaba en nuestro servidor y luego enviaba a nuestros browsers para que se renderice. Luego, usamos `jQuery` para agregar data directamente al DOM. Para el equivalente de React, vamos a usar algo llamado `state`.

En nuestra aplicación de React, el estado debería ser la cantidad minima de data necesaria para renderizar nuestro UI, y es normalmente representado por un objeto de JavaScript.

1. Si no lo has hecho aún, escribe un método constructor para tu clase del paso anterior.
1. Define `this.state` (e.g, `this.state = { foo: 'bar' }`) en el constructor de tu componente `Main` como un objeto Javascript con algo de data en el. Puede ser lo que quieras, por ahora (un saludo, o un numero - algo simple).
1. En tu método `render`de la clase, podes ahora acceder a las propiedades desde `this.state` como cualquier propiedad de un objeto. Interpola el o los valores de tu estado a tu JSX usando llaves!

### Ley de Inicialización

Notaste como, en el ejemplo anterior, inicializamos el estado en el constructor con `this.state = { foo: 'bar' }? Era en realidad bastante importante que inicialicemos nuestro estado con un balor por defecto. ¿Por qué no querriamos inicializar el estado con algo como `this.state = { foo: null }` o `this.state = {}`?

Considera la diferencia entre estos dos constructores:

```js
constructor(props) {
  super(props);
  this.state = {
    favoritePuppy: {},
    allPuppies: [],
    numberOfDogTreatsRemaining: 0,
    ownerName: ''
  }
}
```

vs.

```js
constructor(props) {
  super(props);
  this.state = {
    favoritePuppy: null,
    allPuppies: null,
    numberOfDogTreatsRemaining: null,
    ownerName: null
  }
}
```

¿Qué código te gustaria mantener? Al inicializar el objeto del estado con valores por defecto, estas documentando de los tipos de datos que estan en el estado. Eso es bastante útil!

Además, cuando inicializamos nuestros tipos apropiadamente, implicitamente nos estamos protegiendo de `TypeErrors`. Considerá lo siguiente:

```js
constructor(props) {
  super(props);
  this.state = { kittens: [] } // no hay gatitos aún
}

render() {
  return (
    <div>
      { this.state.kittens.map(kitten => <div>{kitten.name}</div>) }
    </div>
  );
}
```

En este ejemplo, no tenemos gatitos (quizás los obtengamos de nuestro servidor mas tarde). Sin embargo, nuestro método `render` puede tranquila y declarativamente usar `Array.prototype.map` sin preocuparse de un `TypeError`. Esto no sería el caso si `this.state.kittens` se inicializara con `null`!

Estas dos ventajas de inicializar el estado por lo menos con un nivel de profundidad la vamos a llamar:

#### LEY DE INICIALIZACIÓN: EL ESTADO TIENE QUE SER SIEMPRE INICIALIZADO CON EL TIPO DE DATO APROPIADO

Nunca rompanla Ley de Inicialización. Siempre inicialicen su estado apropiadamente!

### Componentes Hijos

Ahora que entendemos lo basico de renderear, traegamos a nuestro sidebar y footer devuelta a la imagen. Podríamos tomar el markup de nuestro `index.html` y ponerlo en el método `render`de  nuestra clase `Main`, pero si hicieramos eso para toda nuestra app, las cosas se irian de las manos bastante rápido, no? En cambio, hagamos unos nuevos componentes.

1. Haz dos nuevos componentes, uno del `Sidebar` y otro para el `Footer`. Podes llamarlo `Sidebar.jsx` y `Footer.jsx` respectivamente, y colocarlos en tu directorio `browser/react`.
1. Toma el markup del `index.html` original (lo que comentamos antes) y continua a los dos componentes que acabas de crear.
1. Importalos y usalosdentro de nuestro método renderde la clase `Main`.Eso va a causar que se llamen a sus métodos `render`también.

Cuando termines, las cosas deberían verse muy parecia a cuando empezamos!

+++Fijate aquí si algo se ve mal
Asegurate que el componente `Sidebar` incluya los tags `<sidebar>` dentro, y lo mismo para el `Footer` debería incluir los tags `<footer>`.
+++

## Todos los Albumes

### Nuestra Colección de Albumes

Debajo hay un arreglo de fake albumes, apropiadamente completado con fake data:

```js
const fakeAlbums = [
  {
    name: 'Abbey Road',
    id: 1,
    imageUrl: 'http://fillmurray.com/300/300',
    songs: [
      {
        id: 1,
        name: 'Romeo & Juliette',
        artists: [ 
          { name: 'Bill' } 
        ],
        genre: 'Funk',
        audioUrl: 'https://learndotresources.s3.amazonaws.com/workshop/5616dbe5a561920300b10cd7/Dexter_Britain_-_03_-_The_Stars_Are_Out_Interlude.mp3'
      }, 
      {
        id: 2,
        name: 'White Rabbit',
        artists: [
          { name: 'Bill' }, 
          { name: 'Alice' }
        ],
        genre: 'Fantasy',
        audioUrl: 'https://learndotresources.s3.amazonaws.com/workshop/5616dbe5a561920300b10cd7/Dexter_Britain_-_03_-_The_Stars_Are_Out_Interlude.mp3'
      }, 
      {
        id: 3,
        name: 'Lucy in the Sky with Diamonds',
        artists: [ 
          { name: 'Bob' } 
        ],
        genre: 'Space',
        audioUrl: 'https://learndotresources.s3.amazonaws.com/workshop/5616dbe5a561920300b10cd7/Dexter_Britain_-_03_-_The_Stars_Are_Out_Interlude.mp3'
      }
    ]
  },
  {
    name: 'Yellow Submarine',
    id: 2,
    imageUrl: 'http://fillmurray.com/300/300',
    songs: [
      {
        id: 4,
        name: 'London Calling',
        artists: [ 
          { name: 'Bill' } 
        ],
        genre: 'Punk',
        audioUrl: 'https://learndotresources.s3.amazonaws.com/workshop/5616dbe5a561920300b10cd7/Dexter_Britain_-_03_-_The_Stars_Are_Out_Interlude.mp3'
      }
    ]
  }
];
```

1. Agregá esta data a un campo en el objeto de tu estado de tu componente `Main`. Querés ser capaz de acceder diciendo `this.state.albums` o algo similar.
1. Interpolá algo de información trivial de cada album (por ejemplo, su nombre) en el método `render`, solo para confirmar que funciona. ¿Recordás lo que podemos hacer para iterar sobre un arreglo en JSX? (_Pista: es solo un método del arreglo el cual deberías estar bastante familiarizado!_).

+++Un empujón a la dirección correcta
Recordá que podes usar métodos del arreglo para retornar JSX. [Aquí hay un ejemplo](https://reactjs.org/docs/lists-and-keys.html#rendering-multiple-components) de la documentación, si te olvidaste como se ve.
+++

+++Solución
```js
// Algo en tu JSX que tu metodo render retorna...

{
  this.state.albums.map(function (album) {
    return album.name;
  }) // cuidado - no punto y coma!
}
```
+++

### Muestralos

Ahora que tenes el album en tu estado, aquí hay un poco de esqueleto de JSX para componente `Main` para que renderice apropiadamente:

```html
<div className="col-xs-10">

  <div className="albums">
    <h3>Albums</h3>
    <div className="row">

      <div className="col-xs-4">
        <a className="thumbnail" href="#">
          <img src="http://placeholdit.imgix.net/~text?txtsize=33&txt=ALBUMoneIMAGE&w=300&h=300" />
          <div className="caption">
            <h5>
              <span>ALBUM ONE NAME HERE</span>
            </h5>
            <small>NUMBER OF SONGS HERE songs</small>
          </div>
        </a>
      </div>

      <div className="col-xs-4">
        <a className="thumbnail" href="#">
          <img src="http://placeholdit.imgix.net/~text?txtsize=33&txt=ALBUMtwoIMAGE&w=300&h=300" />
          <div className="caption">
            <h5>
              <span>ALBUM TWO NAME HERE</span>
            </h5>
            <small>NUMBER OF SONGS HERE songs</small>
          </div>
        </a>
      </div>
    </div>
  </div>
</div>
```

1. Agrega este JSX a tu componente `Main` entre tu `Sidebar` y `Footer` similar a la estrucutra del `index.html` original.
1. Completa ese JSX interpolando valores del estado. Asegurate de usar `.map` oara iterar sobre todos los albumes en el arreglo (no lo harcodies!)

Sabrás que lo lograste si tu vista se ve algo asi:

![screenshot](screenshot1.png)

Si todo funciona pero ves un error en la consola, continua a la siguiente sección.

### La Key

Para este punto, todo debería verse bien, pero si ves la consola del cliente, probablemente veas un gran mensaje de error como este:

---

```Warning: Each child in an array or iterator should have a unique "key" prop. Check the render method of resultTable. See https://fb.me/react-warning-keys for more information```

---

Al parecer, este error no causa ningun problema funcional, pero lo que significa es que React quiere que le proveas de un atributo especial al JSX que retornas de tu map llamado key. Recuerda que parte de lo que hace al Virtual DOM de React tan performante es que puede calcular el numero mínimo de cambios que tiene que hacer al DOM. Sin embargo, cuando creamos JSX en un loop (como cuando usamos `Array.prototype.map`), se vuelve más difícil para React mantener un seguimiento de la estructura del DOM. Para ayudar a React acelerar su busqueda para estos elementos, le damos al padre de cada set de JSX que retornamos del loop un valor llamado `key` que debería ser único dentro del loop.

1. Agregá un prop `key` al JSX para nuestros albumes. ¿Querés un ejemplo? Bien, ¿por qué no fijarnos en [la página que la advertencia de arriba](https://fb.me/react-warning-keys) nos estaba hablando?

### Props

Mmm, el método `render` de nuestro componente `Main` esta viendose bastante pesado otra vez. Qué hacer... ya se! Hagamos un componente `Albums` para que maneje todo nuestro JSX que acabamos de agregar! De esa forma, vamos a ser capaces de reusar facilmente todo ese JSX si encontramos otro lugar en nuestra aplicación que queramos mostrar albumes.

Parece como que tenemos un problema. Estamos recibiendo toda la información del album a la vista desde el estado, pero ya no tenemos acceso al estado en nuestro nuevo componente. No te preocupes: nuesto componente con estado puede pasar data que nuestro componente `Albums` necesita via [props](https://reactjs.org/docs/components-and-props.html)!

1. Refactoreá el JSX de la página anterior a su propio componente `Albums`.
2. Importa el nuevo componente y añadilo al método `render`de nuestro componente `Main`.
3. Toma la data que nuestro componente necesita y pasala como _props_ al componente `Albums`.
4. Asegurate de cambiar cualquier referencia al `state` en nuestro componente para que sea `props`!

### Api

API significa _Application Programming Interface_ y puede referirse a muchas cosas. En nuestro caso, podríamos decir que el sevidor expone una RESTful JSON API, que significa:

- Un rol de nuestro servidor es servir data JSON.
- Esa data tiene la intención de servir programas, no usuarios finales directamente.
- Pedidos y respuestas por esta data se ajusta a un standard y una interfaz uniforme ([REST](https://en.wikipedia.org/wiki/Representational_state_transfer))

Mirá a traves del código del servidor, particularmente  `server/app/index.js` y los archivos dentro de `server/app/routes`.  Descubre que rutas buscarian:

- Todos los albumes
- Un album específico
- El cover art de un album específico (el archivo real de la imagen).
- El archivo de audio de una canción especifica (un request correcto debería causar que tu browser cargara un reproductor de audio nativo donde puedas escuchar la canción).

Mira cada uno de estos cuando navegues al URL correcto en tu browser. Es lindo saber que podemos acceder toda la base de datos de nuestro servidor a través de simples llamados HTTP como estos. Por supuesto, nuestro usuario puede no apreciar tener que escribir GET requests manualmente, así que continuemos nuestra lección de React con un poco de AJAX.

### Axios

Para hacer nuestros pedidos AJAX, vamos a usar una librería liviana y facil de usar para hacer pedidos HTTP desde el cliente llamada [axios](https://github.com/axios/axios).

Para usar `axios` para pedidos GET, simplemente entra el nombre de tu target url al método `.get` de `axios`. `axios`retorna una promesa para el resultado de ese request.

```js
import axios from 'axios';

axios.get('api/someData')
  .then(response => {
    return response.data;
  })
  .then(data => {
    console.log('success');
    console.log(data);
  })
  .catch(err => {
    console.error('error');
    console.error(err);
  });
```

...o podríamos hacer lo mismo pero más conciso:

```js
import axios from 'axios';

const toJson = response => response.data;
const log = console.log.bind(console);
const logError = console.error.bind(console);

axios.get('api/someData')
  .then(toJson)
  .then(log)
  .catch(logError);
```

> _Nota al Pie: a diferencia de Node, algunos métodos de consola del browser, como `log` o èrror` no estan pre-bindeados a `console`, por lo que no podes simplemente decir `.then(console.log)`. La maquinaria de las promesas va a llamar a la función `log` en el futuro sin ningun contexto (ej. `console`), causando un error. Las dos soluciones comunes son A)pasar una función anónina que llama a `console.log` con un contexto específico, o B) crea una función bindeada como arriba._

Nota que `axios.get(...)` retorna una promesa por una respuesta HTTP. Podes esperar lógicamente que esta `response` sea lo que hemos enviado a través de `res.json()` desde el servidor. Bueno, es realmente un objeto conteniendo mucha más información adicional sobre la respuesta (body, status code, headers, etc.). Nuesta data de json esta dentro de la propiedad `data` de ese objeto.

1. Hace un pedido a nuestro backend usando `axios`. Lo podes poner ** en cualquier lugar** en uno de nuestros archivos JavaScript por ahora. Haz un request a `/api/albums/` y loggeá el resultado de hacer ese request en la consola.
2. Mira si podes encontrar el body de la respuesta inspeccionandolo en la consola de Chrome.
3. Una vez que hayas encontrado el body de la respuesta del HTTP en el objeto `response`, construí una cadena de promesas que resuelva a el body de la respuesta como en el ejemplo de arriba.

### Component Lifecycle

Antes de cargar la data de nuestra API a la aplicación de React, hablemos del [ciclo de vida](https://facebook.github.io/react/docs/state-and-lifecycle.html#adding-lifecycle-methods-to-a-class) de los componentes de React y los hooks asociados que React provee. Hay varios de estos, pero iremos por los tres más básicos por ahora:

#### componentWillMount

Corre justo antes el render inicial de un componente. A este punto, nuesto componente de React solo existe en React - no hay nodos del DOM reales correspondientes al componente de React y elementos de React que el componente renderiza (el termino _mounting_ se refiere al nodo del DOM real en el documento).

#### componentDidMount

Corre inmediatamente luego del render inicial. Si un componente renderiza componentes hijos, los hooks `componentDidMount` de los componentes hijos corren antes que los del padre. Para este punto, el componente y todos sus hijos tienen nodos del DOM reales asociados a ellos.

#### componentWillUnmount

Corre justo antes que el componente sea removido del DOM.

Si queremos hacer un llamado AJAX que eventualmente actualice el estado de nuestra app, en que parte del lifecycle del componente crees que pertenece?

|||
`componentDidMount`, no `componentWillMount`
|||

¿Podés imaginarte por qué?

|||
Cuando corre `componentWillMount` significa que nuestro componente todavía no esta montado por lo que si el usuario llegase a "desmontar" el componente o este no se llegase a montar antes de que recibamos la data, hariamos un setState de un componente desmontado! Esas son malas noticias! Por lo tanto es mejor asegurarse que el componente ya haya sido montado en el DOM.
|||

### Cargalos

Deja de usar la data de fake albums y renderiza los verdaderos albumes guardados en la base de datos de tu servidor. Fijate si podes hacerlo por tu cuenta, pero la pista de abajo te dara más detalle de como hacerlo si te trabás.

+++Aproximación

Primero, deberíamos setear un estado inicial en el constructor de nuestro componente `Main` (recuerda la **Ley de Inicialización**). Ya que vamos a renderizar una vez antes de recibir los albumes del servidor, necesitamos setear algo ahi por default (como un default de un parametro de una función) para asegurarnos de no tener ningún `TypeError` en nuestro `render`.

Segundo, dentro de el método `componentDidMount` de nuestro componente  vamos a querer hacer un pedido AJAX para conseguir la data. Una vez que el pedido se completa podemos llamar `this.setState()` para actualizar el estado con nuestra data y disparar un re-render.

También, notá que el estado lo debería tener nuestro componente `Main`y no el componente `Albums`. La razón de eso es que no sabemos todavía si va a haber otros componentes que `Main` renderize que vayan a necesitar también a los albumes, por lo que es siempre más seguro de mantener nuestro estado ["arriba en nuestro árbol de componentes"](https://reactjs.org/docs/react-component.html), por lo menos hasta que sepamos que es seguro moverlo abajo.
+++ 


## Cambiando Vistas

### La Vista de un Solo Album

Bien! Tenemos una hermosa lista de albumes frente a nosotros. Cuando clickeamos uno, queremos actualizar la vista para mostrar solo ese album, como también una lista de canciones en ese album.

Empecemos con la vista, les parece?

1. Haz un nuevo archivo para armar el nuevo componente (y dale un nombre original como `SingleAlbum.jsx`)
2. Crea una nueva clase  de `React.Component` en ese archivo y haz que su método `render` rentorne el JSX de abajo:

```html
<div className="album">
  <div>
    <h3>I SHOULD BE AN ALBUM NAME</h3>
    <img src="https://placeholdit.imgix.net/~text?txtsize=33&txt=IshouldBEanIMAGE&w=300&h=300" className="img-thumbnail" />
  </div>
  <table className='table'>
    <thead>
      <tr>
        <th></th>
        <th>Name</th>
        <th>Artists</th>
        <th>Genre</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>
          <button className="btn btn-default btn-xs">
            <span className="glyphicon glyphicon-play"></span>
          </button>
        </td>
        <td>I SHOULD BE A SONG NAME</td>
        <td>I SHOULD BE A STRING OF THIS SONG'S ARTISTS</td>
        <td>I SHOULD BE A SONG GENRE</td>
      </tr>
      <tr>
        <td>
          <button className="btn btn-default btn-xs">
            <span className="glyphicon glyphicon-play"></span>
          </button>
        </td>
        <td>I SHOULD BE ANOTHER SONG NAME</td>
        <td>I SHOULD BE A STRING OF THAT SONG'S ARTISTS</td>
        <td>I SHOULD BE A SONG GENRE</td>
      </tr>
    </tbody>
  </table>
</div>
```

3. `import` tu nuevo componente a tu `Main.jsx` y renderizalo debajo de nuesto compomenente `Albums`, solo para asegurarte que funciona. Si lo logras, entonces tu vista debería verse algo como esto:

![screenshot](screenshot2.png)  

### Selected Album

Viendose bien! Pongamos información real del album en él. Ya tenemos los albumes en nuestro estado, pero necesitamos una forma de indicar el album actualmente seleccionado. Suena como que tenemos que actualizar el objeto de nuestro estado!

1. En el constructor para nuestro componente `Main`, inicializa una nueva propiedad (algo lindo, como `selectedAlbum`). No te olvides de la **Ley de Inicialización**! Inicializalo para que sea un **objeto vacio** (ya que estaremos guardando un objeto ahi luego)!

### Click Listener

Agreguemosun click listener a cada uno de nuestros albumes  (lo vamos a poner en cada `<a>` tag). Recuerda que, de la misma manera que tenemos para decir `className` en vez de `class` para nuestros elementos JSX, necesitamos decir `onClick` en vez de `onclick`.

1. Necesitamos usar `this.setState`, por lo tanto escribe un método en tu componente `Main` que reciba el album que queremos seleccionar como parametro. Llamalo algo como... `handleClick`.
2. Bindea los metodos en tu constructor (vamos a enventualmente pasarlos como un callback a nuestro click listener, por lo que necesitamos preservar el contexto de `this`).
3. Pasá este método como un prop a nuestro componente `Albums`.
4. Ahora que tenemos el método disponible como un prop en nuestro componente `Album`, necesitamos pasarlo a nuestro click handler. Sin embargo, también queremos asegurarnos de pasar el album que queramos como un argumento. Que hacer... quizás podemos darle al click listener una función anónima en cambio?

|||
```JSX
<a onClick={() => this.props.handleClick(album)}>
```
|||

5. Ahora que tenemos una forma de cambiar nuestro album actual seleccionado en el estado, pasa el actual album como prop al componente `SingleAlbum`! Cambiá el JSX para interpolar la información del album individual para que tengas la información correcta cuando renderize (seguramente notes que no tienes todo lo que necesitas... eso esta bien, lo arreglaremos próximamente!)

### Fetch el Single Album

Como habrás notado, no parece como que tengamos toda la información que necesitamos para mostrar las canciones (fijate en http://localhost:1337/api/albums - las canciones en cada album solo tiene ids!)

Sin embargo, fijate que pasa cuando buscamos solo un album (http://localhost:1337/api/albums/1, por ejemplo). Eso se ve mucho mejor!

1. En vez de usar un album del arreglo albumes de nuestro estado, modifica el click handler para que busque el album del servidor y pone ese en el estado en cambio!

+++Si tenes problemas, fijate esto primero

```js
// hazlo para que el método que invoquemos cuando elegimos un album acepte el id del album,
// y usa eso para buscar el album apropiado del servidor
handleClick (albumId) {
  axios.get('/api/albums/' + albumId)
    .then(/** tu haz el resto */)
}
```

+++  

|||

```js
handleClick (albumId) {
  axios.get(`/api/albums/${albumId}`)
    .then(res => res.data)
    .then(album => // Usar arrow functions es importante aquí! De otra forma, nuestro contexto de this sería undefined!
      this.setState({ selectedAlbum: album })
    );
}
```
Una vez que tenes el album, completa el resto del JSX para mostrar la información de las canciones (asegurate de mapear sobre cada canción en el arreglo de canciones del album!)

+++Error al mapear las canciones
Es probable que cuando intentas mapear las canciones del album te aparezca un error que no puede leer la propiedad `map` de `undefined` esto es porque cuando no tenemos una canción seleccionda la propiedad songs no existe, por lo que vas a tener que chequear si esa propiedad existe antes de mapearla
+++

+++Mas ayuda por favor
Primero nos fijamos si esapropiedad existe y luego le hacemos un map.
```js
{this.props.album.songs && this.props.album.songs.map(...)}
```
+++

|||

### Cambiar Vista

Vamos bien! Ahora clickeamos un album en nuestra lista de albumes, el album seleccionado va a aparecer debajo en la página. Pero eso no es lo que queremos realmente... queremos que la vista cambie cuando selecciónamos un album para que solo veamos el album seleccionado. Tomate un momento y piensa -  ¿cómo podemos decir de nuestro estado si hemos elegido un album o no?

+++Así es como
Nuestro album seleccionado en el estado va a ser un objeto vacío (si ningún album es seleccionado), o un objeto representando un album (una vez que hayamos elegido uno) - por lo que podemos ver si existe una propiedad que el album siempre tendría (como su id).
+++

Suena como que podríamos cambiar condicionalemente entre si queremos renderizar el componente `Albums` o el componente `SingleAlbum`. Normalmente, esto sería un trabajo para el `if`, pero desafortunadamente no podemos usar un `if` statement directamente en una expresión JSX - sin embargo, podemos usar un operador ternario! ¿Te acordás cómo funcionaban? [Fijate en estos documentos](https://reactjs.org/docs/conditional-rendering.html) para un recordatorio!

1. Modificá el JSX en tu componente `Main` para que solo el componente `Albums` se muestre al principio,y luego después de clickear un album, solo el componente `SingleAlbum` se muestre (con el album elegido).

### De-Seleccionar Album

Genial, nuestra vista esta cambiando! Pero... al parecer no podemos ir para atras a la vista de todos los albumes sin refreshear la página. Hagamos que si clickeamos el link `Albums` en el componente `Sidebar` mostraremos todos los albumes otra vez.

1. Escribe un nuevo método en tu componente `Main` que "resetee" el `selectedAlbum` a su estado inicial.
2. Pasa el método como un prop al componente `Sidebar` (y no te olvides de `bind`).
3. Pone el prop como un click handler al JSX apropiado dentro del componente `Sidebar`

## Que Haya Música

### Play Audio

Si llegaste tan lejos y entendes los conceptos cubiertos hasta ahora, entonces **buen trabajo**! Diría que estas bastante buena forma con los fundamentos de React! Por esta razón, la siguiente sección va a ser un poco más difícil y va ver menos lineamientos.

---

Habiendo dicho esto, que sería **Juke** sin el reproductor de audio? Pongamos un poco de música! Por favor ponete tus auriculares para no molestar a tus vecinos.

HTML5 viene con un [elemento `<audio>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/audio), que podemos usar así:

```js
const audio = document.createElement('audio');
audio.src = 'https://learndotresources.s3.amazonaws.com/workshop/5616dbe5a561920300b10cd7/Dexter_Britain_-_03_-_The_Stars_Are_Out_Interlude.mp3';
audio.load();
audio.play();
// por ahora, refresca la página si queres para la música
```

De hecho, hace que esta canción se reproduzca cuando cualquier boton de play en la lista de canciones es clickeado. No te preocupes de reproducir la canción correcta aún, solo haz que esos botones hagan eso.


+++Aproximación
Tratá usando un listener `onClick` en cada botón.
+++

+++Como funcionaba esto...?
`onClick` causa que una función sea invocada cuando el elemento del DOM es clickeado. Esto puede incluir acceder (o llamar) un método en un componente. Si queremos que un componente invoque un método en su padre, podemos simplemente pasar el método del padre al hijo via props (asegurandose de bindear el `this` al componente padre!)
+++

+++...si, voy a necesitar mas
En tu componente `Main` vas a querer algo como esto:

```JSX

// Declara nuestro audio como global al módulo, para que podamos usarlo
const audio = document.createElement('audio');

class Main extends React.Component {
  /* ... */
  constructor (props) {
    super(props);
    // Estamos pasando `this.start` como un click listener, por lo que nos tenemos que asegurar de bindearlo
    // para preservar este contexto de "this" dentro de la función.
    // No estamos usando "this" dentro de this.start, pero quizas querramos más adelante...
    this.start = this.start.bind(this);
  }

  start () {
    audio.src = 'https://learndotresources.s3.amazonaws.com/workshop/5616dbe5a561920300b10cd7/Dexter_Britain_-_03_-_The_Stars_Are_Out_Interlude.mp3';
    audio.load();
    audio.play();
  }

  render () {
    /** algo de jsx */
    <Album start={this.start} />
    /** más jsx */
  }
}
```
Luego en nuestro Album podés agregar algo como:

```JSX
onClick={this.props.start}
```

para cada botón.
+++

### La Canción Correcta

Ahora hazlo de tal forma que cada botón de play reproduzca la cancion que corresponda. Solo concentrate en reproducir por ahora, ya vamos a llegar a pausar.

...

Más facil decirlo que hacerlo? Hay dos grandes pasos:

1. Localiza la fuente de audio de cada canción.

2. Haz ahora que cuando clickees "play" cause que el audio correcto se reproduzca

+++Aproximación
Podemos pasar la función handler directamente al `onClick` de esta forma:

```JSX
<button onClick={this.props.start}>
```

El problema aquí es que no podemos pasar ningun argumento a nuestro método "start". Sin embargo, podemos pasar una función anónima al `onClick` también:

```JSX
<button onClick={() => this.props.start()}>
``` 

Ahora podemos pasarle los argumentos que querramos!
+++

### El Estado Actual de las Cosas

Perdón, todavía no estamos pausando. En cambio, trabajemos en darle a nuestro usuario algun feedback visual cuando reproducen una canción. Paso uno: necesitamos una forma de saber si una canción esta reproduciendose!

Recuerda - que la única forma de causar que el render method se vuelva a ejecutar es usando `setState`. Esto significa que necesitamos encontrar una forma de representar esto en el objeto de nuestro estado.

1. Toma un momento para discutir con tu compañero como pueden representar una canción siendo reproducida en tu estado.

+++Nuestra sugerencia
Podemos representar esto con un campo llamado `currentSong`, que guarde el objeto de la canción seleccionada, o el id de la canción
+++ 

2. Agregá el campo apropiado al objeto `state`.

Recordás como antes hicimos `this.start = this.start.bind(this)`? Si usás `this.setState` dentro de la función `start`, es importante que `start` mantenga el `this` original incluso aunque sea pasado alrededor a otros componentes. Esto es un problema bastante común en React y asegurarte que estas usando `this` apropiadamente es importante. 

### Feedback Visual

Estamos apuntando a algo así:

![screenshot](screenshot3.png)

1. Empecemos escondiendo el botón play cuando una canción esta reproduciendose.

+++Aproximación
Recordá que podes interpolar expresiones JavaScript a JSX, como con el operador ternario.
+++ 

2. Ahora hagamos que el fondo de la row de la canción se marque cuando la canción empieza. Desde el punto de la vista, bootstrap hace esto bastante conveniente parar nosotros. Abre el inspector de elementos y agregá la clase `active` y mirá como bootstrap hace el trabajo por nosotros. 

Ahora, ¿cómo hacer trabajar esto en la lógica de nuestro render? Sabías que le podes dar a `className` una expresión interpolada que evalue a un string?

+++Una posible solución
```JSX
album.songs.map(function (song) {
  return (
    <tr className={song.id === this.props.currentSong.id ? 'active' : ''}> //etc...
  )
})
```
+++


3. Si no lo has hecho aún, haz que solo una canción puede ser reproducida al mismo tiempo. No te preocupes de la canción terminado o nada parecido a eso, solo hazlo que si un usuario clickea una canción, para la anterior y reproduce la nueva.

### Player

Habramos nuestro componente `Footer` y empecemos esta fiesta! Aquí hay un checklist de cosas para hacer para ayudarte:

- Solo muestra los controles del reproductor una vez que una canción empieza a reproducirse
- Cambia el botón de play al botón de pausa una vez que la canción empice a reproducirse
- Haz que el botón de pausa realmente pausee. 
- Cambia del botón de pausa al de play luego de que pause sea clickeado

Trata de no mirar estas pistas (y son solo pistas, no soluciones) a menos que te hayas trabado:

+++Controles del reproductor visibles solo cuando se reproduce
¿No tenes algún tipo de propiedad del estado que puede ser útil? Probablemente podamos pasarlo al componente que lo necesite
+++

+++Cambiar play a pausa mientras la cancion se reproduce y vice-versa
Suena como que hay un par de factores aquí. Hay una cancion reproduciendose que causa que una cancion se reproduzca o no, etc. Vas a necesitar algun estado que se fije esto. 
+++

+++Pausando
vas a necesitar usar el API de `audio` de HTML5. Multiples funciones van a necesitar tener acceso a este objeto para que puedan llamar a varios métodos cuando ciertas acciones ocurren.
+++

###  Siguiente & Anterior

Ahora hace el botones de siguiente y anterior funcionen.

Comienza en concentrarte en los casos comunes (canciones del medio), luego adelantate y fijate en los casos limites. Clickear para adelante en la última canción debería empezar la primera, y clickear en la primera debería empezar la última.

También podes hacer que cuando una canción termine, la siguiente comience a reproducirse. Los elementos HTML `<audio>` tienen un evento `'ended'` que podes agregar via `.addEventListener`. Intentalo, ¿sabés dónde agregar el event listener?

+++Solución... por ahora
```js
// en tu componente Main
...
componentDidMount () {
  /** ... */
  audio.addEventListener('ended', () => {
    this.next(); // u otra manera de ir a la siguiente canción
  });
  /** ... */
}
...
```
+++

### Progress Bar

El elemento `<audio>` también tiene un evento `'timeupdate'`. Usemos esto para mostrar el porcentaje que falta.

1. Agregá un campo `progress` al estado.
2. Actualiza el `progress` cuando `"timeupdate"' así:

```js
// Main.js
componentDidMount () {

  /** ... */

  // Recordá, los efectos secundarios como agregar event listeners van en componentDidMount!
  audio.addEventListener('timeupdate', () => {
    this.setState({
      progress: 100 * audio.currentTime / audio.duration
    });
  });

  /** ... */

}
```

3. Luego arrojá esto en algun lugar de la vista: `<h3>Percent complete: { this.state.progress }%</h3>`.

4. Una vez que tengas eso funcionando, podes remover el JSX que pusimos, y en cambio usar un [inline style](https://reactjs.org/docs/dom-elements.html#style) en la progress bar así:

```JSX
...
// Porque dos llaves?
// La expresión que estamos interpolando es realmente solo un objeto!
<div class="progress-bar" style={{width: `${progress}%`}}></div>
...
```

## Refactorear

### Principio de Responsabilidad Única

Una de las mejores cosas sobre React es que te permite construir componentes que pueden ser reusados a través de tu aplicación. Para que este patrón sea efectivo sin embargo, tenemos que mantener en mente [el principio de responsabilidad única](https://medium.com/@ericclifford/single-responsibility-principle-in-javascript-4d51f78b6d5b), cada componente debería hacer solo una cosa y hacerla bien.

Ahora mismo, tenemos un componente manejando el estado para toda nuestra app. Ese es un gran trabajo - por qué también debería preocuparse sobre nuestra lógica de la vista? Llevemos toda nuestra lógica de la vista fuera de nuestro componente `Main` y pongamoslo dentro de otro componente presentacional. De esa forma, nuestro manejo del estado puede ser totalmente separado de nuestra lógica del view.

En el ecosistema de React, deberíamos referirnos a nuestros componentes con estado como `contenedores`, porque contienen estado. Separar nuestros contenedores de nuestros componentes sin estado, o `presentacionales` puede ser un patrón poderos, que libera nuestros componentes presentacionales a que sean movidos y reusados como queramos, lo único que necesitamos hacer es enviarle las props correctas, y funcionaran sin importar que componente esta manejando su estado.

Imaginen que queremos escalar nuesta app Juke para que sea bastante grande - de que otra forma podríamos romper la estructura de la vista a componentes más pequeños y modulares?

### Stateless Functional Components

Ahora mismo, nuestros componentes sin estado son clases que solo contienen un metodo render. Esto esta bien, pero hay una mejor forma! Lee sobre [stateless functional components](https://reactjs.org/docs/components-and-props.html#functional-and-class-components) y refactorea nuestras clases sin estado a simples funciones. Escribir componentes sin estado como funciones hace a nuestro código mucho mas limpio y legible. También hace mas claro que, en React, nuestra vista debería ser solamente una función pura y predecible de nuestro estado: `function render(state) => view`.

### Ley de los Componentes Tontos

Entonces para este punto, deberíamos tener una distinción entre nuestros componentes `contenedores` (o `inteligentes`, o `con estado`) y nuestros componentes `presentacionales`(o `tontos`, o `sin estado`). Seguramente te estas preguntando cuanto renderizar en un componente inteligente, y si definir alguna lógica en tu componente tonto. La respuesta a eso esta una segunda ley:

#### LEY DE LOS COMPONENTES TONTOS: LOS COMPONENTES TONTOS TIENEN QUE SER LO MÁS TONTO POSIBLE - SOLO DEBERÍAN CALCULAR LA VISTA Y NADA MÁS!

Esto significa que todos los métodos y estados deberían estar en los componentes con estado, y toda la vista de la lógica debería ser la unica responsabilidad de los tontos (pero puros) componentes presentacionales. Una buena indicación que estas **rompiendo** la ley de los componentes tontos es si un componente presentacional no puede ser escrita como un `stateless functional component`.

¿Tenes algún componente que este rompiendo la **Ley de los Componentes Tontos**? Fijate en tu código! Refactoreá si es necesario!

### Mejor ES6

Dado que ya estamos transpilando nuestro Javascript para usar JSX, también podemos asegurarnos que estamos tomando aprovechando completamente las ventajas de ES6! Es mas que solo cambios cosmeticos, también podemos usar ES6 para hacer nuestro código más legible y menos verboso, que lo hace más resistente a errores en el largo plazo. Aquí hay un par de lugares que podés considerar limpiar...

- ¿Estás usando arrow functions eficientemente? Fijate si hay algún lugar que estes usando el keyword `function` que podría ser remplazado por un arrow.
- Estas accediendo a todos los props que envias para abajo uno por uno, como `this.props.album` y `this.props.handleClick`? Hay una forma mejor! Podes usar asignacion con destructuración para extraer los valores que queres de un objeto.

```js
render () {
  const { album, handleClick } = this.props;
  return (
    /* ...JSX... */
  );
}
```

- Aun mejor, si estas usando stateless functional components, podes usar asignación con destructuración en la definición de la función! No solo se va a ver mas limpio, sino que veras todas las dependencias del componente presentacional sin tener que leer a través del JSX. Esto es una gran victoria. Por ejemplo, si el método `render` fuese un stateless function:

```js
export default ({ album, handleClick }) => (
  /* ...JSX... */
);

```

## Bonus

### Shuffle

Agrega un boton de shuffle a un album. Si el usuario presiona este botón, el reproductor debería reproducr las canciones en un orden random. Pero no debería repetir una canción hasta que ya haya tocado todas las otras. Por lo que tendría que recorrer aleatoriamente a través de la lista, y luego de un ciclo debería hacer otro ciclo aleatorio, etc. Presionar el botón otra vez dejaría la cancion actual seguir tocando, pero cambiaría devuelta al comportamiento de progresión normal.

### Scrubber

Haz que un usuario pueda clickear en un lugar del progress bar y vaya al punto en la cancion. Buena suerte!

### Keyboard Input

Agrega atajos del teclado, para que puedas pausar y poner play con el spacebar e ir adelate/atras con las teclas de los costados. La documentación para el [sistema de eventos](https://facebook.github.io/react/docs/events.html) de React es un buen lugar para empezar.







