# liquibase-mongo-poc

## Pré requisitos

 - Liquibase: <https://docs.liquibase.com/install/liquibase-windows.html>

 - Docker (para criar o banco de dados mongo)
    - Como alternativa, o mongodb pode ser usado localmente. Basta seguir as seguintes configurações:
        - db: liquibaseDb
        - user: liquibase
        - pwd: liquibase
        - role: dbOwner
<br><br>

## Inicialização


Inicializar o banco de dados mongo:

``` docker-compose up ```
<br><br>
Verificar se o liquibase está conectado corretamente ao mongo:

``` liquibase status ```
<br><br>
## Comandos liquibase

Atualizar o banco de dados com as migrations existentes:

``` liquibase update ```
<br><br>
Desfazer a última alteração:

``` liquibase rollback-count 1 ```
<br><br>

Existem diversos [comandos do liquibase](https://docs.liquibase.com/commands/home.html), porém alguns só estão disponíveis na versão Pro ou não funcionam corretamente com o mongodb (normalmente por estarem relacionados a sql).
<br><br>

## Adicionar migration

As migrations são adicionadas no arquivo **changelog.xml** (o arquivo de migrations, assim como outros detalhes, pode ser configurado no **liquibase.properties**). 

Ao incluir uma nova migration, uma tag `<changeSet>` deve ser incluída como no exemplo abaixo, onde é criada a collection *LiquibaseDb*:

```xml
    <changeSet id="1" author="matheusantonio">
		<ext:runCommand>
			<ext:command>
				{ create : "LiquibaseDb" }
			</ext:command>
		</ext:runCommand>
	</changeSet>
```

Dependendo do comando executado, deve ser informada a operação realizada durante o rollback. Para adicionar o rollback na migration uma tag `<rollback>` deve ser incluída:

```xml
    <changeSet id="1" author="matheusantonio">
		<ext:runCommand>
			<ext:command>
				{ create : "LiquibaseDb" }
			</ext:command>
		</ext:runCommand>
		<rollback>
			<ext:runCommand>
				<ext:command>
					{ drop : "LiquibaseDb" }
				</ext:command>
			</ext:runCommand>
		</rollback>
	</changeSet>
```

As migrations acima foram executadas através da tag `<ext:runCommand>` que executa um [comando no mongodb](https://www.mongodb.com/docs/manual/reference/command/). 

Como alternativa, o liquibase possui por padrão [tags com operações do mongo](https://docs.liquibase.com/install/tutorials/mongodb.html), como `<ext:createCollection collectionName="LiquibaseDb">` e `<ext:dropCollection collectionName="LiquibaseDb">`, análogas aos dois comandos utilizados no exemplo anterior.