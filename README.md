# liquibase-mongo-poc

## Pré requisitos

 - CLI do Liquibase: <https://docs.liquibase.com/install/liquibase-windows.html>

 - Docker (para criar o banco de dados mongo)
    - Como alternativa, o mongodb pode ser usado localmente. Basta um usuário com as seguintes configurações:
        - user: liquibase
        - pwd: liquibase
        - role: dbOwner para o bando liquibase
<br><br>


## Configurações 

Existem dois arquivos de configuração, **liquibase-docker.properties** e **liquibase.properties** que representam configurações diferentes para ambientes de homologação e produção, respectivamente. Essas configurações são informadas ao executar as migrations.
<br><br>


## Inicialização


Inicializar o banco de dados mongo (caso queira utilizar o banco com docker):

``` docker-compose up ```
<br><br>
Verificar se o liquibase está conectado corretamente ao mongo:

``` liquibase --defaultsFile=liquibase-docker.properties status ```
<br><br>
## Comandos liquibase

Atualizar o banco de dados com as migrations existentes:

``` liquibase --defaultsFile=liquibase-docker.properties update ```
<br><br>

Atualizar o banco de dados com as migrations existentes testando execução do rollback:

``` liquibase --defaultsFile=liquibase-docker.properties update-testing-rollback ```
<br><br>

Atualizar o banco de dados com uma migration específica testando execução do rollback:

``` liquibase --defaultsFile=liquibase-docker.properties --changeLogFile=changes/20230509-CHANGE_1.xml  update-testing-rollback ```
<br><br>

Desfazer as últimas N alterações:

``` liquibase --defaultsFile=liquibase-docker.properties rollback-count 1 ```
<br><br>

Existem diversos [comandos do liquibase](https://docs.liquibase.com/commands/home.html), porém alguns só estão disponíveis na versão Pro ou não funcionam corretamente com o mongodb (normalmente por estarem relacionados a sql).
<br><br>

## Adicionar migration

As migrations são adicionadas em um arquivo XML na pasta **changes**.

Ao incluir uma nova migration, uma tag `<changeSet>` deve ser incluída como no exemplo abaixo, onde é criada a collection *liquibase-docker*:

```xml
    <changeSet id="1" author="matheusantonio">
		<ext:runCommand>
			<ext:command>
				{ create : "liquibase-docker" }
			</ext:command>
		</ext:runCommand>
	</changeSet>
```

Também pode ser informada a operação realizada durante o rollback. Para adicionar o rollback na migration uma tag `<rollback>` deve ser incluída:

```xml
    <changeSet id="1" author="matheusantonio">
		<ext:runCommand>
			<ext:command>
				{ create : "liquibase-docker" }
			</ext:command>
		</ext:runCommand>
		<rollback>
			<ext:runCommand>
				<ext:command>
					{ drop : "liquibase-docker" }
				</ext:command>
			</ext:runCommand>
		</rollback>
	</changeSet>
```

As migrations acima foram executadas através da tag `<ext:runCommand>` que executa um [comando no mongodb](https://www.mongodb.com/docs/manual/reference/command/). 

Como alternativa, o liquibase possui por padrão [tags com operações do mongo](https://docs.liquibase.com/install/tutorials/mongodb.html), como `<ext:createCollection collectionName="liquibase-docker">` e `<ext:dropCollection collectionName="liquibase-docker">`, análogas aos dois comandos utilizados no exemplo anterior.
<br><br>

O arquivo criado para a migration deve ser referenciado no arquivo **changelog.xml** (configurável nos arquivos **liquibase-docker.properties** e **liquibase.properties**) através da tag `<include>`:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<databaseChangeLog>
	...
    <include file="changes/20230509-CHANGE_1.xml" />

</databaseChangeLog>

```