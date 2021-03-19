Declare @rfid varchar(50);
Declare @member varchar(50);
Declare @documentNumber varchar(50);

Set @rfid = '{{{payload.rfid}}}';
Set @member = '{{{payload.member}}}';
Set @documentNumber = '{{{payload.dni}}}';

IF (not @rfid = '0')
BEGIN
    Declare @T Table (Socio varchar(40));
    Declare @V VARCHAR(40);
    Insert @T EXEC calipso.[dbo].[PorteriaRFIDDevolverSocio] @NumeroRfId = @rfid;
    Select @V = Socio from @T;
    
    EXEC calipso.[dbo].[Porteriacontrol] @Numero = @V, @DNI='',@Servicio='00001';
END

IF (not @member = '0')
BEGIN
    EXEC calipso.[dbo].[Porteriacontrol] @Numero = @member, @DNI='',@Servicio='00001';
END

IF (not @documentNumber = '0')
BEGIN
    EXEC calipso.[dbo].[Porteriacontrol] @Numero = '', @DNI=@documentNumber,@Servicio='00001';
END