# Parser API SDN Skype for Business

El objetivo de este proyecto es el de parametrizar la información recibida por la SDN API de Skype for Business con el objetivo de obtener información suficiente como para implementar QoS en tiempo real asi como para obtener reportes de las llamadas en curso de la plataforma.

### Documentación

- https://docs.microsoft.com/en-us/skype-sdk/sdn/articles/configuring-sdn-interface-using-the-command-prompt
- https://msdn.microsoft.com/en-us/library/office/mt269085-(v=office.16).aspx - SDN API Documentation Root
- https://msdn.microsoft.com/en-us/library/office/mt404709(v=office.16).aspx - Schema Reference SDN API 3.0 D
- https://msdn.microsoft.com/en-us/library/office/mt149423(v=office.16).aspx - Schema Map SDN API 3.0 D - Ver funcionalidad de los campos
- https://msdn.microsoft.com/en-us/library/office/mt404775(v=office.16).aspx - Elementos enviados durante la llamada
- http://ucken.blogspot.com.ar/2015/07/in-call-qoe-in-skype4b.html - InCallQoE y InCallQoS



## Esquema de actualizaciones API

    <LyncDiagnosis>
	    Start Element
	    InCallQuality Updates
	    End Element
	    Quality Update - Resument 
    </LyncDiagnosis>

## Comandos útiles
    
#### Consultar Status

        Get-CsSdnStatus -SdnPoolUri http://localhost:9333/Settings

#### Agregar Listener

        Add-CsSdnListener -SdnPoolUri http://localhost:9333/Settings -Identifier SdnPool.CONTOSO.COM

#### Consultar Listener

        Get-CsSdnListener -SdnPoolUri http://localhost:9333/Settings
        <add key="configurationserviceuri" value="http://172.17.230.3:9333/Settings"/> -- WAC es SDNM

#### No ofuscar SIP URI

        Set-CsSdnManagerParameter -SdnPoolUri http://localhost:9333/Settings -Parameter hidepii -Value True
