
# media comment
notificar(id_ssp, request.user.id, '/verMedia/%s/%s'%(id_ssp,id_media), 'Ha comentado un archivo', id_media, 'Media')

# análisis comment
notificar(id_ssp, request.user.id, '/verAnalisis/%s/%s'%(id_ssp,id_analisis), 'Ha comentado un analisis', id_analisis, "Analisis")

# richPicture comment
notificar(id_ssp, request.user.id, '/verRichPicture/%s/%s'%(id_ssp, id_rp), 'Ha comentado un Rich Picture', id_rp, 'RichPicture')

# DefRaiz comment
notificar(id_ssp, request.user.id, '/verDefinicionRaiz/%s/%s'%(id_ssp,id_dr), 'Ha comentado una Definicion Raiz', id_dr, 'DefinicionRaiz')



# create media
notificar(id_ssp, request.user.id, '/verMedia/%s/%s'%(id_ssp,newMedia.id), 'Agrego un nuevo archivo', newMedia.id, 'Media')

# new DefRaiz
notificar(id_ssp, request.user.id, '/verDefinicionRaiz/%s/%s'%(id_ssp,newDR.id), 'Agrego una nueva Definicion Raiz', newDR.id, 'DefinicionRaiz')
