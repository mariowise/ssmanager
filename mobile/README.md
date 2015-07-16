SSManager Móvil
===============

La aplicación móvil puede ser entendida a partir de trés componentes fundamentales:

* **API REST**: Se trata de una API construida sobre el framework `django-rest-framework`, bajo la tecnología `JWT`, publicando servicios REST sobre cada recurso de la base de datos.
* [**Sync**](https://github.com/mariowise/ssmanager/tree/master/mobile/app/js/lib/sync): Se trata de una librería de la aplicación capaz de administrar el almacenamiento remoto, local y parte de su sincronización. El objetivo es proveer a la capa de servicios de métodos que asistan las labores de almacenamiento de datos.
* **Services**: Corresponde a la capa de servicios de `Angular`. Heredan todos los métodos de la clase `Resource` del módulo `Sync`, e implementan métodos específicos para cada entidad. Los servicios son consumidos por los controladores de la aplicación móvil, contienen la lógica de negocios de toda operación.

